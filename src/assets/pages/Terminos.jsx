import React from 'react';
import  Components from '../components/Components'
const {
    TitlePage,  
    TitleSection, 
    ContentTitle, 
    Paragraphs, } = Components;

const PrivacyPolicy = () => {
  return (
    <section className='w-full flex flex-col'>
    <TitlePage label="Términos y Condiciones" />

    <div className="mb-4 md:mb-0 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">

        <Paragraphs label="La Universidad Tecnológica de la Huasteca Hidalguense (UTHH), con domicilio en Chalahuiyapa S/N, Colonia Tepoxteco, Huejutla de Reyes, Huejutla de Reyes, CP. 43000, Hidalgo, México, es responsable del tratamiento de los datos personales que nos proporcione, los cuales serán protegidos conforme a lo dispuesto por la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados, y demás normatividad aplicable." />

        <TitleSection label="Plataforma de Evaluación Educativa" />
        <Paragraphs label="Ofrecemos una plataforma en línea que permite a los usuarios, como educadores y estudiantes, participar en evaluaciones educativas y gestionar contenido educativo."/>
        
        <TitleSection label="Registro de Usuario" />
        <Paragraphs label="Los usuarios pueden registrarse en la plataforma proporcionando información precisa y completa."/>
        <Paragraphs label="Los usuarios pueden cargar y compartir contenido educativo, como evaluaciones y materiales didácticos."/>
        
        <TitleSection label="Privacidad y Protección de Datos" />

        <Paragraphs label="La información personal proporcionada durante el registro y el uso de la plataforma está sujeta a nuestra Política de Privacidad." />
        <Paragraphs label="Al utilizar nuestros servicios, usted acepta el tratamiento de sus datos personales de acuerdo con nuestra Política de Privacidad." />
        
        <TitleSection label="Limitación de Responsabilidad" />
        <Paragraphs label="Universidad Tecnológica de la Huasteca Hidalguense, UTHH, no será responsable por daños directos, indirectos, incidentales o consecuentes resultantes del uso de la plataforma." />
        <Paragraphs label="Los usuarios comprenden y aceptan que Plataforma de Evaluacion Educativa no garantiza la disponibilidad ininterrumpida de la plataforma y no será responsable por interrupciones del servicio." />

        <TitleSection label="Uso Aceptable" />
        <Paragraphs label="Los usuarios se comprometen a utilizar la plataforma de manera ética y legal, evitando actividades que puedan dañar la plataforma o interferir con el uso de otros usuarios." />
        <Paragraphs label="Universidad Tecnológica de la Huasteca Hidalguense, UTHH, no se hace responsable por el mal uso de la plataforma por parte de los usuarios, incluido, pero no limitado a, la publicación de contenido ilegal o inapropiado." />

        <TitleSection label="Propiedad Intelectual" />
        <Paragraphs label="Universidad Tecnológica de la Huasteca Hidalguense, UTHH, retiene los derechos de propiedad sobre el software, el diseño y otros elementos de la plataforma." />
        <Paragraphs label="Los usuarios conservan los derechos de propiedad sobre el contenido que cargan, pero otorgan a Plataforma de Evaluacion Educativa una licencia no exclusiva para usar, reproducir y distribuir dicho contenido en el contexto de la plataforma." />

        <TitleSection label="¿Qué datos personales solicitamos y para qué fines?" />
        <table className="min-w-full bg-white border border-gray-300 mb-4">
            <thead>
                <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">
                    Finalidad
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">
                    ¿Requieren consentimiento del titular?
                </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Gestión Académica</td>
                <td className="px-6 py-4 text-sm text-gray-900">Sí</td>
                </tr>
                <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Personalización del Aprendizaje</td>
                <td className="px-6 py-4 text-sm text-gray-900">Sí</td>
                </tr>
                <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Comunicación y Retroalimentación</td>
                <td className="px-6 py-4 text-sm text-gray-900">Sí</td>
                </tr>
                <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Seguimiento del Progreso Individual</td>
                <td className="px-6 py-4 text-sm text-gray-900">Sí</td>
                </tr>
                <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Verificar y confirmar su identidad</td>
                <td className="px-6 py-4 text-sm text-gray-900">Sí</td>
                </tr>
                <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Realizar todos los movimientos con motivo del trámite o servicio</td>
                <td className="px-6 py-4 text-sm text-gray-900">No</td>
                </tr>
            </tbody>
        </table>

        <Paragraphs label="Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, se solicitarán los siguientes datos personales:" />
        <ul className="list-disc pl-5">
            <li>Nombre</li>
            <li>Edad</li>
            <li>Correo electrónico institucional</li>
            <li>Teléfono Celular</li>
            <li>Fotografía</li>
            <li>Cierta información sobre la actividad y preferencias de los usuarios y visitantes dentro de nuestro sitio web y las apps de nuestros servicios</li>
        </ul>

        <TitleSection
            label="Marco Legal"
            className="text-2xl font-bold text-gray-800 mt-4"
        />

        <TitleSection label="Protección de Datos y Privacidad" />
        <Paragraphs label="Los usuarios aceptan que la recopilación y el uso de sus datos personales se rigen por nuestra Política de Privacidad, la cual cumple con las leyes de privacidad aplicables." />

        <TitleSection label="Derechos de Autor y Propiedad Intelectual" />
        <Paragraphs label="Todo el contenido proporcionado por Plataforma de Evaluacion Educativa está protegido por derechos de autor. Los usuarios conservan los derechos de propiedad sobre el contenido que cargan, otorgando a [Nombre de tu Plataforma Educativa] una licencia limitada para su uso en la plataforma." />

        <TitleSection label="Leyes de Uso de Internet" />
        <Paragraphs label="Los usuarios se comprometen a utilizar la plataforma de manera ética y legal, cumpliendo con todas las leyes y regulaciones aplicables en el uso de Internet." />

        <TitleSection label="Accesibilidad" />
        <Paragraphs label="Plataforma de Evaluacion Educativa se esfuerza por cumplir con las leyes de accesibilidad web para garantizar un acceso equitativo a todos los usuarios." />



        <TitleSection
            label="¿Con quién compartimos su información personal y para qué fines?"
            className="text-xl font-semibold text-gray-800 mb-4"
        />
        <Paragraphs
        label="Se informa que no se realizarán transferencias de datos personales, salvo aquéllas que sean necesarias para atender requerimientos de información de una autoridad competente, que estén debidamente fundados y motivados."
        />   
        
        <TitleSection
            label="¿Cuál es el fundamento para el tratamiento de datos personales?"
        />
        <Paragraphs
        label="Consentimiento del Titular de los Datos: La Universidad obtendrá el consentimiento explícito de los estudiantes, profesores para el tratamiento de sus datos personales en el contexto de la plataforma educativa. Este consentimiento será informado, libre y voluntario, y los titulares de los datos tendrán el derecho de retirarlo en cualquier momento."
        />
        <Paragraphs
        label="Cumplimiento de Obligaciones Legales: La Universidad tratará datos personales cuando sea necesario para cumplir con las obligaciones legales aplicables, como la presentación de informes a las autoridades educativas competentes."
        />
        <Paragraphs
        label="Se dará el trato a los datos personales que se recaben a través del sistema con fundamento en los artículos 16, 18, 21, 22, 25, 26 y 65 de la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados."
        />
        
        <TitleSection
        label="¿Cómo puedo ejercer mi derecho a la portabilidad de datos personales?"
        className="text-xl font-semibold text-gray-800 mb-4"
        />

        <Paragraphs
        label="Le informamos que podrá presentar su solicitud de portabilidad de datos personales con el siguiente alcance:"
        />
        <Paragraphs
        label="En la UTHH, los datos personales que recopilamos se almacenan de manera segura en nuestra base de datos protegida. Esta base de datos está diseñada para garantizar la confidencialidad, integridad y disponibilidad de los datos personales que nos confía."
        />
        <Paragraphs
        label="Asimismo, le informamos que los datos personales técnicamente portables son los siguientes:"
        />
        <ul className="list-disc list-inside ml-4 mb-4">
        <li>Nombre</li>
        <li>Edad</li>
        <li>Correo electrónico institucional</li>
        <li>Fotografía</li>
        </ul>

        <Paragraphs
        label="Finalmente, dichos datos personales se encuentran disponibles para su entrega en los siguientes formatos estructurados y comúnmente utilizados: Los titulares de datos tienen el derecho de solicitar y recibir una copia de sus datos personales en un formato estructurado, comúnmente utilizado y legible por máquina en formato PDF."
        />
        <TitleSection
        label="¿Dónde puedo ejercer mis derechos ARCO?"
        className="text-xl font-semibold text-gray-800 mb-4"
        />
        <Paragraphs
        label="Usted podrá presentar su solicitud para el ejercicio de los derechos de acceso, rectificación, cancelación u oposición de sus datos personales (derechos ARCO) directamente ante nuestra Unidad de Transparencia, cuyos datos de contacto son los siguientes:"
        />
        <ul className="list-disc list-inside ml-4 mb-4">
        <li>Nombre de su titular: UTHH</li>
        <li>Domicilio: Huejutla-Chalahuiyapa s/n, Colonia Tepoxteco, Huejutla de Reyes, Huejutla de Reyes, CP. 43000, Hidalgo, México</li>
        <li>Correo electrónico: rectoria@uthh.edu.mx</li>
        <li>Número telefónico y extensión: 789 8962088</li>
        </ul>

        <Paragraphs
        label="Asimismo, usted podrá presentar una solicitud de ejercicio de derechos ARCO a través de la Plataforma Nacional de Transparencia, disponible en http://www.plataformadetransparencia.org.mx, y a través de los siguientes medios: Usted podrá ejercer los derechos de acceso, rectificación, cancelación u oposición (Derechos ARCO)."
        />
        <Paragraphs
        label="Con relación al procedimiento y requisitos para el ejercicio de sus derechos ARCO, le informamos lo siguiente:"
        />

        <Paragraphs
        label="La solicitud para el ejercicio de los derechos ARCO deberá contener:"
        className="mb-4"
        />

        <div className="ml-6 space-y-2  text-gray-500 dark:text-gray-400">
            <p className="list-decimal list-inside">
                <span className="font-bold">I.</span> El nombre del titular y su domicilio o cualquier otro medio para recibir notificaciones;
            </p>
            <p className="list-decimal list-inside">
                <span className="font-bold">II.</span> Los documentos que acrediten la identidad del titular y, en su caso, la personalidad e identidad de su representante;
            </p>
            <p className="list-decimal list-inside">
                <span className="font-bold">III.</span> De ser posible, el área responsable que trata los datos personales y ante el cual se presenta la solicitud;
            </p>
            <p className="list-decimal list-inside">
                <span className="font-bold">IV.</span> La descripción clara y precisa de los datos personales respecto de los que se busca ejercer alguno de los derechos ARCO, salvo que se trate del derecho de acceso;
            </p>
            <p className="list-decimal list-inside">
                <span className="font-bold">V.</span> La descripción del derecho ARCO que se pretende ejercer, o bien, lo que solicita el titular;
            </p>
            <p className="list-decimal list-inside">
                <span className="font-bold">VI.</span> Cualquier otro elemento o documento que facilite la localización de los datos personales.
            </p>
        </div>

        <Paragraphs
        label="Ahora bien, tratándose de una solicitud de acceso a datos personales, deberá señalar la modalidad en la que prefiere que éstos se reproduzcan; con relación a una solicitud de cancelación, deberá señalar las causas que lo motiven a solicitar la supresión de sus datos personales en los archivos, registros o bases de datos; en el caso de la solicitud de oposición, deberá manifestar las causas legítimas o la situación específica que lo llevan a solicitar el cese en el tratamiento, así como el daño o perjuicio que le causaría la persistencia del tratamiento, o en su caso, las finalidades específicas respecto de las cuales requiere ejercer el derecho de oposición; finalmente, si se trata de una solicitud de rectificación, se sugiere incluir los documentos que avalen la modificación solicitada."
        className="mt-4"
        />

        <p className="mb-4  text-gray-500 dark:text-gray-400">
        Los formularios, sistemas y otros métodos simplificados para facilitarle el ejercicio de sus derechos ARCO podrán consultarlos en{' '}
        <a href="http://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
            www.inai.org.mx
        </a>.
        </p>

        <p className="mb-4 text-gray-500 dark:text-gray-400">
        Por último, se le informa que usted tiene derecho a presentar un recurso de revisión ante el INAI, cuando no esté conforme con la respuesta, directamente en las instalaciones del Instituto o a través de la Plataforma Nacional de Transparencia. Para mayor información, consulte{' '}
        <a href="http://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
            www.inai.org.mx
        </a> o llame al 01-800-835-43-24.
        </p>

        <TitleSection label="¿Cómo puede conocer los cambios en este aviso de privacidad?" />
        <Paragraphs
        label="El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales o por otras causas."
        className="mb-4"
        />
        <p className="mb-4 text-gray-500 dark:text-gray-400">
        Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad, a través de: Correo Electronico
        </p>
        <p className="mb-4 text-gray-500 dark:text-gray-400">
        Si hacemos algún cambio en cómo tratamos tus datos, te avisaremos por los canales habituales, como el correo electrónico o mensajes a través de las aplicaciones de nuestras plataformas. En los casos en los que necesitemos tu aprobación, te lo comunicaremos por estos medios para que decidas si estás de acuerdo.
        </p>

        <TitleSection label="Otros datos de contacto:" />
        <ul className="list-disc list-inside mb-4 pl-5 text-gray-500 dark:text-gray-400">
        <li>
            Página de Internet: <a href="http://www.uthh.edu.mx/" className="text-gray-800 hover:underline">http://www.uthh.edu.mx/</a>
        </li>
        <li>
            Correo electrónico para la atención del público en general: <a href="mailto:rectoria@uthh.edu.mx" className="text-gray-800 hover:underline">rectoria@uthh.edu.mx</a>
        </li>
        <li>
            Número telefónico para la atención del público en general: 789 8962088
        </li>
        </ul>

        <p className="font-bold mb-4">Última actualización: 14/11/2023</p>
    </div>
    </section>

  );
};

export default PrivacyPolicy;
