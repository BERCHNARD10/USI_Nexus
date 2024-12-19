import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useAuth } from '../../server/authUser'; // Importa el hook de autenticación
import  Components from '../../components/Components'
const {TitlePage, ContentTitle, Paragraphs, Link} = Components;
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import esLocale from 'date-fns/locale/es'; // Importa la localización en español
//import moment from 'moment';

const locales = {
  'es': esLocale, // Agrega la localización en español a tu objeto de locales
};

//import 'moment/locale/es';
//moment.locale('es');
// Configura momentLocalizer con moment
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
  locale: esLocale, // Especifica el idioma español aquí
});


const MyCalendar = () => {
  const { userData } = useAuth();
  const [calendarData, setCalendarData] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Configura moment en español

  // Simular una solicitud para obtener los datos del servidor
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}calendario.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matriculaAlumn: userData.vchMatricula,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del calendario');
        }

        const data = await response.json();
        setCalendarData(data); // Guardar los datos en el estado local
      } catch (error) {
        console.error('Error al obtener los datos del calendario:', error);
      }
    };

    fetchData();
  }, [userData.vchMatricula]);

  // Procesar los datos y crear eventos para el calendario
  const events =
    calendarData?.message.map(event => ({
      title: event.vchNomActivi,
      start: new Date(event.dtmFechaEntrega),
      end: new Date(event.dtmFechaEntrega),
      allDay: true,
    })) ?? [];

  // Imprime la configuración de moment y las fechas en events para depurar
  /*console.log('Configuración de moment:', moment.locale()); // Verifica la configuración de moment
  console.log('Eventos:', events); // Verifica las fechas en events*/

  return (
    <section className='w-full flex flex-col'>
    <TitlePage label="Calendario de actividades"/>
    <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8 ">
    <div className='m-auto' style={{ height: 600, width: 1100 }}>
      <Calendar
      className=' p-6'
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
      />
    </div>
    </div>
  </section>

  );
};

export default MyCalendar;
