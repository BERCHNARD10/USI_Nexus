import React, { useState, useEffect } from 'react';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import { useParams } from 'react-router-dom';
import { Tabs, Accordion } from "flowbite-react";
import { HiClipboardList, HiUserGroup } from "react-icons/hi"; // Actualiza aquí
import Components from '../../components/Components';
//import * as XLSX from 'xlsx'
//import * as XLSXStyle from 'xlsx-style';
import ExcelJS from 'exceljs';

import { saveAs } from 'file-saver';
const { TitlePage, ContentTitle, Paragraphs, Link, TitleSection } = Components;

const DetalleMateria = () => {
  const { userData } = useAuth(); // Obtén el estado de autenticación del contexto
  const [actividades, setActividades] = useState([]);
  const [alumnos, setAlumnosMaterias] = useState([]);
  const { vchClvMateria, chrGrupo, intPeriodo } = useParams();
  const [loading, setLoading] = useState(false);
  const webUrl = import.meta.env.VITE_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
 

  const onloadActividades = async () => {
    try {
      const response = await fetch(`${apiUrl}cargarMaterias.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clvMateria: vchClvMateria,
          matriculaDocent: userData.vchMatricula,
          chrGrupo: chrGrupo,
          periodo: intPeriodo,
        }),
      });

      const requestData = {
        clvMateria: vchClvMateria,
        matriculaDocent: userData.vchMatricula,
        chrGrupo: chrGrupo,
        periodo: intPeriodo,
      };

      console.log("datods: ", requestData)
      const result = await response.json();
      console.log(result);

      if (result.done) {
        setActividades(result.message);
      } else {
        console.error('Error en el registro:', result.message);
        if (result.debug_info) {
          console.error('Información de depuración:', result.debug_info);
        }
        if (result.errors) {
          result.errors.forEach(error => {
            console.error('Error específico:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error 500', error);
      setTimeout(() => {
        alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.');
      }, 2000);
    }
  };

  const onloadAlumnos = async () => {
    try {
      const response = await fetch(`${apiUrl}accionesAlumnos.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clvMateria: vchClvMateria,
          matriculaDocent: userData.vchMatricula,
          chrGrupo: chrGrupo,
          periodo: intPeriodo,
        }),
      });
      const result = await response.json();
      console.log("datoalumnos: ", result)

      if (result.done) {
        setAlumnosMaterias(result.message);
      } else {
        console.error('Error en el registro:', result.message);
        if (result.debug_info) {
          console.error('Información de depuración:', result.debug_info);
        }
        if (result.errors) {
          result.errors.forEach(error => {
            console.error('Error específico:', error);
          });
        }
      }
    } catch (error) {
      console.error('Error 500', error);
      setTimeout(() => {
        alert('¡Ay caramba! Encontramos un pequeño obstáculo en el camino, pero estamos trabajando para superarlo. Gracias por tu paciencia mientras solucionamos este problemita.');
      }, 2000);
    }
  };

  useEffect(() => {
    onloadActividades();
    onloadAlumnos();
  }, []);

  const groupActivitiesByParcial = (activities) => {
    return activities.reduce((groups, activity) => {
      const { intParcial } = activity;
      if (!groups[intParcial]) {
        groups[intParcial] = [];
      }
      groups[intParcial].push(activity);
      return groups;
    }, {});
  };

  const groupedActivities = groupActivitiesByParcial(actividades);

  const fetchAndGenerateExcel = async (parcial) => {
    setLoading(true);

    try {
      //const idActividades = actividades.map((actividad) => actividad.intClvActividad);
      console.log('Datos de actividades:', actividades);
      console.log('Parcial recibido:', parcial);

      // Filtrar actividades por parcial
      const filtrarActividadesPorParcial = (actividades, parcial) => {
          return actividades.filter(actividad => actividad.intParcial === Number(parcial));
      };

      const actividadesFiltradas = filtrarActividadesPorParcial(actividades, parcial);
      console.log(`Actividades del Parcial ${parcial}:`, actividadesFiltradas);

        // Obtener solo los intClvActividad de las actividades filtradas
        const actividadesIds = actividadesFiltradas.map(actividad => actividad.intClvActividad);
        console.log(`IDs de Actividades del Parcial ${parcial}:`, actividadesIds);

      const requestData = {
          clvMateria: vchClvMateria,
          grupo: chrGrupo,
          periodo: intPeriodo,
          numeroActividad: actividadesIds
        };
        console.log("server ",requestData)


      const responseInit = await fetch(`${apiUrl}obtenerCalificacionesParcial.php`, 
        {
          method: 'POST',
          headers: 
          {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
        const resultInit = await responseInit.json();
        console.log("ACTIVIDADES ",requestData)

      if (resultInit.done) {
        console.log(resultInit.message)

        const response = await fetch(`${apiUrl}obtenerCalificacionesParcial.php`, 
          {
            method: 'POST',
            headers: 
            {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              detalleActividades: resultInit.message.detalleActividades,
              practicasActividades: resultInit.message.practicasActividades,
          })
          });
          const result = await response.json();
          if(result.done)
          {
            console.log("datosgeneraexcel", result)
            exportToExcel(result.userData, result.message, result.sessionExpirationString);
          }
      }
      else 
      {
        console.error('Error fetching data:', resultInit.message);
      }
    } 
    catch (error) 
    {
      console.error('Error:', error);
    } 
    finally 
    {
      setLoading(false);
    }
  };



  const exportToExcel = async (info, data, detalleActPract) => {
    if (!data || data.length === 0) {
        console.error('No hay datos disponibles para exportar');
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Calificaciones');

    // Convertir número de columna (base 1) a letra (A, B, C, ..., Z, AA, AB, ...)
    const columnLetter = (index) => {
      let letter = '';
      while (index >= 0) {
          letter = String.fromCharCode((index % 26) + 65) + letter;
          index = Math.floor(index / 26) - 1;
      }
      return letter;
    };

    // Calcular el número total de columnas, incluyendo las de prácticas y la columna adicional
    const practiceColumns = Object.keys(data[0]).filter(key => key.startsWith('P'));
    const activityColumns = Object.keys(data[0]).filter(key => key.startsWith('ACTIVIDAD'));
    console.log('Actividades/Practicas', activityColumns, practiceColumns);
    const numberOfPracticeColumns = practiceColumns.length;
    const numberOfActivityColumns = activityColumns.length;
    console.log('NoActividades/NoPracticas', numberOfActivityColumns, numberOfPracticeColumns);

    // Ajustar el número total de columnas considerando que "A" y "B" ya están ocupadas
    const totalColumns = numberOfPracticeColumns+numberOfActivityColumns+2;
    console.log('totalColumns', totalColumns);

    const columnsInfo = numberOfPracticeColumns + 2; // +2 para incluir la columna de "Cal Final"
    const adjustedTotalColumns = totalColumns + 1; // Agregar 1 porque las prácticas comienzan en la columna C
    console.log('total de columnas', adjustedTotalColumns);

    // Obtener la letra de la última columna
    const endColumnInfo = columnLetter(columnsInfo - 2); // Restar 1 porque el índice es base 0
    console.log("Imprimir info principal hasta la columna: ",endColumnInfo); // Debería imprimir 'I' si numberOfPracticeColumns es 7
    
    const startAct = columnLetter(columnsInfo - 1); // Restar 1 porque el índice es base 0
    console.log("Imprimir actividades desde la columna: ",startAct); // Debería imprimir 'I' si numberOfPracticeColumns es 7
    
    const rowAct = columnLetter(columnsInfo); // Restar 1 porque el índice es base 0
    console.log("Columna de inicio de ACT: ",rowAct); // Debería imprimir 'I' si numberOfPracticeColumns es 7
    

    // Obtener la letra de la última columna
    const endColumnLetter = columnLetter(adjustedTotalColumns - 1); // Restar 1 porque el índice es base 0
    console.log("Imprimir titulo hasta la columna: ",endColumnLetter); // Debería imprimir 'I' si numberOfPracticeColumns es 7
    
    // Obtener la fila donde se encuentra la palabra Matricula
    const startCal = (numberOfActivityColumns*4)+3; // Restar 1 porque el índice es base 0
    console.log("Imprimir fila donde empiezan las cal: ",startCal); // Debería imprimir 'I' si numberOfPracticeColumns es 7

    const ultimaCelda = startCal+ data.length+2;
    const ultimoBorde =  endColumnLetter+ultimaCelda;
    console.log("ultima celda", ultimoBorde)

    // Estilo para el título
    const titleStyle = {
      font: { name: 'Calibri', size: 20, bold: true, color: { argb: '0F243E' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '5B9BD5' } },
    };

    worksheet.mergeCells(`A1:${endColumnLetter}3`);
    worksheet.getCell('A1').value = 'CONTROL DE CALIFICACIONES';
    worksheet.getCell('A1').style = titleStyle;

    // Aplicar borde a todas las celdas combinadas para el título
    for (let col = 1; col <= totalColumns; col++) {
        for (let row = 1; row <= 3; row++) {
            worksheet.getCell(columnLetter(col - 1) + row).border = {
                top: { style: 'medium', color: { argb: '000000' } },
                left: { style: 'medium', color: { argb: '000000' } },
                bottom: { style: 'medium', color: { argb: '000000' } },
                right: { style: 'medium', color: { argb: '000000' } }
            };
        }
    }


    let currentRow = 4;
    worksheet.mergeCells(`A${currentRow}:${endColumnInfo}${startCal}`);

    const cell = worksheet.getCell(`A${currentRow}`);
    // Detalles de info
    cell.value = `${info.Nombre_Carrera}\n` +
                `GRUPO: ${info.Grupo}\n` +
                `CUATRIMESTRE: ${info.Cuatrimestre}\n` +
                `PARCIAL: ${info.Parcial}`;

    // Aplicar formato a la celda combinada
    cell.font = { size: 20, bold: true }; // Ajusta según sea necesario
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; // Centrado y ajuste de texto
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' } // Color de fondo
    };
    cell.border = {
        top: { style: 'medium', color: { argb: '000000' } },
        left: { style: 'medium', color: { argb: '000000' } },
        bottom: { style: 'medium', color: { argb: '000000' } },
        right: { style: 'medium', color: { argb: '000000' } }
    };

    // Añadir detalles de las actividades junto a la información principal
    let activityStartRow = 4;
    let activityCurrentRow = 4;
    detalleActPract.Actividades.forEach((actividad, index) => {
    const startRow = activityStartRow + index * 4;
  
      // Configurar las celdas para cada detalle de la actividad
      const actividadDetalles = [
          { value: actividad.Nombre_Actividad, wrapText: false, bold: true },
          { value: actividad.Descripcion_Actividad, wrapText: true, bold: false },
          { value: `Instrumento: ${actividad.Clave_Instrumento}`, wrapText: true, bold: false },
          { value: `Valor: ${actividad.Valor_Actividad} puntos`, wrapText: true, bold: false }
      ];
  
      actividadDetalles.forEach((detalle, detalleIndex) => {
          const currentRow = startRow + detalleIndex;
  
          worksheet.mergeCells(`${startAct}${currentRow}:${endColumnLetter}${currentRow}`);
          worksheet.getCell(`${startAct}${currentRow}`).value = detalle.value;
          worksheet.getCell(`${startAct}${currentRow}`).font = { size: 9, bold: detalle.bold };
          worksheet.getCell(`${startAct}${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
  
          if (detalle.wrapText) {
              worksheet.getCell(`${startAct}${currentRow}`).alignment.wrapText = true;
          }
  
          // Establecer color de fondo y borde
          worksheet.getCell(`${startAct}${currentRow}`).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '5B9BD5' }
          };
          worksheet.getCell(`${startAct}${currentRow}`).border = {
              left: { style: 'medium', color: { argb: '000000' } },
              right: { style: 'medium', color: { argb: '000000' } }
          };
  
          // Calcular la altura de la fila basada en el contenido de la celda
          const lines = detalle.value.split('\n').length;
          const adjustedHeight = Math.max(15, lines * 15); // Ajustar el factor multiplicador según sea necesario
          worksheet.getRow(currentRow).height = adjustedHeight;
      });
  
      activityCurrentRow = startRow + 3;
  });
  
    // Crear el encabezado
    //currentRow = Math.max(currentRow, activityCurrentRow) + 2; // Start grades table after the longest section
    const headers = [
        "Matrícula",
        "Nombre",
        ...practiceColumns,
        ...Object.keys(data[0]).filter(key => key.startsWith('ACTIVIDAD')),
        "Cal Final"
    ];

    // Definir colores para las actividades
    const activityColors = ['FFC000', '9BC2E6', 'C89696', 'D9EAD3', 'DCE6F1', 'F4CCCC', 'F9CB9C', 'FCE5CD'];

    // Estilo para los encabezados de actividades
    const getActivityHeaderStyle = (color) => ({
        font: { size: 10, bold: true },
        alignment: { wrapText: true, horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: color } },
        border: {
            top: { style: 'medium', color: { argb: '000000' } },
            left: { style: 'medium', color: { argb: '000000' } },
            bottom: { style: 'medium', color: { argb: '000000' } },
            right: { style: 'medium', color: { argb: '000000' } }
        }
    });

    // Agregar una fila vacía
    worksheet.addRow(new Array(adjustedTotalColumns).fill(''));

    // Obtener la última fila agregada
    const lastRow = worksheet.lastRow;

    // Combinar celdas de la columna A a la columna B en la fila recién agregada
    worksheet.mergeCells(`A${lastRow.number}:B${lastRow.number}`);
    worksheet.mergeCells(`C${lastRow.number}:${startAct}${lastRow.number}`);
    worksheet.mergeCells(`${rowAct}${lastRow.number}:${endColumnLetter}${lastRow.number}`);

    const mergedCells = [
        { range: `A${lastRow.number}:B${lastRow.number}`, text: '' },
        { range: `C${lastRow.number}:${startAct}${lastRow.number}`, text: 'Actividades' },
        { range: `${rowAct}${lastRow.number}:${endColumnLetter}${lastRow.number}`, text: 'Resultados' }
    ];

    mergedCells.forEach((cellInfo) => {
        const cell = worksheet.getCell(cellInfo.range.split(':')[0]);
        cell.value = cellInfo.text;
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F4B084' }
        };
        cell.border = {
            top: { style: 'medium', color: { argb: '000000' } },
            left: { style: 'medium', color: { argb: '000000' } },
            bottom: { style: 'medium', color: { argb: '000000' } },
            right: { style: 'medium', color: { argb: '000000' } }
        };
        cell.font = {
            color: { argb: '000000' },
            size: 10,
            bold: true
        };
        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };
    });

    // Ajustar el alto de la fila
    lastRow.height = 24;


    // Insertar el encabezado
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.height = 50; // Ajustar la altura de la fila del encabezado

    // Aplicar alineación y estilo al encabezado
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        const headerText = headers[colNumber - 1];
        if (headerText.startsWith('ACTIVIDAD')) {
            const activityIndex = parseInt(headerText.replace('ACTIVIDAD ', '')) - 1;
            cell.style = getActivityHeaderStyle(activityColors[activityIndex % activityColors.length]);
        } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A9D08E' } };
            cell.border = {
                top: { style: 'medium', color: { argb: '000000' } },
                left: { style: 'medium', color: { argb: '000000' } },
                bottom: { style: 'medium', color: { argb: '000000' } },
                right: { style: 'medium', color: { argb: '000000' } }
            };
        }
    });

    // Ajustar el ancho de las columnas
    worksheet.columns = [
        { width: 15 }, // Matrícula
        { width: 45 }, // Nombre
        ...practiceColumns.map(() => ({ width: 10 })), // Prácticas
        ...Object.keys(data[0]).filter(key => key.startsWith('ACTIVIDAD')).map(() => ({ width: 20 })), // Actividades
        { width: 15 } // Cal Final
    ];

// Añadir los datos
data.forEach(item => {
  const row = [
      item["Matrícula"],
      item["Nombre"],
      ...headers.slice(2, -1).map(key => item[key] !== undefined && item[key] !== null ? item[key] : 0),
      item["Cal Final"] !== undefined && item["Cal Final"] !== null ? item["Cal Final"] : 0
  ];
  const worksheetRow = worksheet.addRow(row);

  // Aplicar estilo a las celdas de datos
  worksheetRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // Centrar el texto en todas las celdas
      // Alineación
      if (headers[colNumber - 1].startsWith('Matrícula') || headers[colNumber - 1].startsWith('Nombre')) {
        cell.alignment = { horizontal: 'left' };
      } else {
          cell.alignment = { horizontal: 'center' };
      }
      // Aplicar bordes
      if (headers[colNumber - 1].startsWith('P')) {
          cell.border = {
              top: { style: 'thin' },
              left: { style: 'medium' },
              bottom: { style: 'thin' },
              right: { style: 'medium' }
          };
      }  else if (headers[colNumber - 1].startsWith('Cal Final')) {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'medium' }
        };
    } else if (headers[colNumber - 1].startsWith('ACTIVIDAD')) {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    } else {
          // Bordes por defecto para otras columnas
          cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
          };
      }
  });
});

/*
const cellBorder = worksheet.getCell(ultimoBorde);
cellBorder.border = {
  bottom: { style: 'medium' }
};*/
for (let col = 1; col <= adjustedTotalColumns ; col++) {
  const cell = worksheet.getCell(ultimaCelda, col);
  cell.border = {
    top: cell.border.top,
    left: cell.border.left,
    right: cell.border.right,
    bottom: { style: 'medium' }
  };
}

    // Añadir los detalles de prácticas después de imprimir todas las calificaciones
    currentRow = worksheet.lastRow.number + 2;

    // Merge de celdas y agregar texto para el título
    worksheet.mergeCells(`D${currentRow}:I${currentRow}`);
    const titleCell = worksheet.getCell(`D${currentRow}`);
    titleCell.value = 'Detalles de Prácticas';
    titleCell.font = { size: 14, bold: true, color: { argb: '000000' } };
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A9D08E' } };
    
    // Aplicar bordes al título
    titleCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    currentRow++;

    Object.entries(detalleActPract.Practicas).forEach(([, value]) => {
        worksheet.mergeCells(`D${currentRow}:I${currentRow}`);
        const detailCell = worksheet.getCell(`D${currentRow}`);
        detailCell.value = value;
        detailCell.font = { size: 10 };
        detailCell.alignment = { wrapText: true, horizontal: 'left', vertical: 'middle' };
    
        // Aplicar bordes a cada celda de detalles
        detailCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        currentRow++;
    });

    // Generar y guardar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Calificaciones.xlsx');
};

  return (
    <section className='w-full flex flex-col'>
      <TitlePage label="Trabajo de clase" />
      <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
        <Tabs aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Actividades" icon={HiClipboardList}>
            {Object.entries(groupedActivities).map(([parcial, activities]) => (
              <div key={parcial}>
                
                <TitleSection label={'Parcial '+ parcial} />
                <button onClick={() => fetchAndGenerateExcel(parcial)} disabled={loading}>
                {loading ? 'Generando Excel...' : `Generar Excel ${'Parcial ' + parcial}`}
                </button>
                <Accordion collapseAll>
                  {activities.map((actividad) => (
                    <Accordion.Panel key={actividad.intClvActividad}>
                      <Accordion.Title>
                        <ContentTitle label={actividad.vchNomActivi} />
                      </Accordion.Title>
                      <Accordion.Content>
                        <Paragraphs label={actividad.vchDescripcion} />
                        <Paragraphs label={`Valor: ${actividad.fltValor} puntos`} />
                      </Accordion.Content>
                      <Accordion.Content>
                        <Link
                          to={`/materias/gruposMaterias/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${actividad.intClvActividad}`}
                          children="Ver Más"
                        />
                      </Accordion.Content>
                    </Accordion.Panel>
                  ))}
                </Accordion>
              </div>
            ))}
          </Tabs.Item>
          <Tabs.Item title="Alumnos" icon={HiUserGroup}>
            <TitlePage label="Alumnos" />
            <div className="p-4">
              {alumnos.map((alumnos) => (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }} key={alumnos.AlumnoMatricula}>
                  <Paragraphs className="mb-0" label={`${alumnos.AlumnoMatricula} - ${alumnos.AlumnoNombre} ${alumnos.AlumnoApellidoPaterno} ${alumnos.AlumnoApellidoMaterno}`} />
                </div>
              ))}
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </section>
  );
};

export default DetalleMateria;
