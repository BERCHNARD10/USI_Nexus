# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

El proyecto **UTHH_PRY** es una **plataforma de educación educativa** diseñada para facilitar la creación y gestión de aulas virtuales, permitiendo a los docentes realizar actividades como la creación de **materias**, **gestión de alumnos**, **asignación de tareas**, y la **calificación** de los estudiantes. Además, incluye la funcionalidad única de generar un **concentrado de calificaciones**, lo que agiliza el seguimiento y evaluación de los estudiantes.

### Funcionalidades Clave

- **Creación de Materias**: Los docentes pueden crear materias y organizarlas dentro de la plataforma para gestionar el contenido y las evaluaciones.
- **Gestión de Alumnos**: Los profesores pueden gestionar el registro de alumnos, asignarles tareas y monitorear su progreso.
- **Asignación y Evaluación de Tareas**: La plataforma permite a los docentes asignar tareas a los estudiantes, que luego pueden ser evaluadas dentro del sistema.
- **Sistema de Calificaciones**: Se pueden introducir y gestionar calificaciones para cada alumno. Además, la plataforma permite generar un **concentrado de calificaciones** automático para facilitar la revisión de notas.
- **Notificaciones en Tiempo Real**: Los estudiantes y profesores reciben notificaciones sobre tareas pendientes, calificaciones y actualizaciones en el aula.
  

## Objetivo general
Este proyecto consiste en el desarrollo de una **Progressive Web App (PWA)** que incluye un sistema de **suscripciones**, **notificaciones push en tiempo real**, funcionalidad **offline**, y una **pasarela de pagos segura**. El objetivo es ofrecer una experiencia similar a una app nativa que permita a los usuarios suscribirse a diferentes planes y acceder a funcionalidades premium mediante una pasarela de pagos confiable.

### Próximas Funcionalidades

- **Pasarela de Pagos Segura**: Implementar una integración segura para que los usuarios puedan realizar pagos que permita a los usuarios suscribirse y acceder a funcionalidades premium de la aplicación. 
- **Sistema de Suscripciones**: Permitir a los usuarios suscribirse a planes mensuales y anuales, gestionar renovaciones y cancelaciones.
- **Notificaciones Push y en Tiempo Real**: Enviar actualizaciones importantes a los usuarios, incluso cuando la aplicación esté cerrada.
- **Funcionalidad Offline y PWA**: Asegurar que la aplicación funcione sin conexión a Internet utilizando **Service Workers**.
- **Diseño Responsivo**: Adaptar la interfaz para móviles, tablets y ordenadores.
- **Experiencia de Usuario Nativa**: Aprovechar características nativas del dispositivo como almacenamiento local y notificaciones.

## Estructura del Proyecto

El proyecto sigue una arquitectura basada en tres capas:
1. **Frontend**: Implementado como una PWA utilizando REACT JS, HTML, CSS y JavaScript.
2. **Backend**: Implementado en PHP con una API tipo ROAST.
3. **Base de Datos**: Mysql utilizada para gestionar los datos de usuarios y suscripciones.

## Metodología de Trabajo
Este proyecto utiliza **Extreme Programming (XP)** para fomentar la comunicación y colaboración constante dentro del equipo. Además, implementa **Trunk-Based Development** como estrategia de versionamiento, permitiendo integrar pequeñas actualizaciones frecuentes en la rama principal.

- **Revisiones frecuentes de código** mediante **pair programming**.
- **Pruebas continuas** para asegurar la calidad de cada nuevo cambio antes de integrarlo.
- **Feedback del cliente** para ajustar los objetivos del proyecto a las necesidades cambiantes.

### Ciclos de Iteración:
Cada iteración tiene una duración de 1-2 semanas, y al final de cada iteración se realiza una reunión de retrospectiva para evaluar el progreso y ajustar las prioridades. Los entregables se revisan constantemente con el cliente.


## Control de Versiones

El proyecto utiliza **Git** como sistema de control de versiones y sigue el flujo de trabajo de **Trunk-Based Development**.

### Estrategia de Versionamiento:
- El desarrollo de cada funcionalidad se realiza en ramas **temporales** cortas que se derivan de la rama principal (`master`).
- Las ramas siguen la convención `feature/nombre-de-la-funcionalidad`. Ejemplos:
- `feature/pasarela-pagos`
- `feature/suscripciones`
- `feature/notificaciones-push`
- `feature/notificaciones-push-backend`
- `feature/apis-logica-negocio`
- `feature/diseno-responsivo`
- `feature/offline-pwa`

- **Integración frecuente**: Las ramas deben fusionarse rápidamente a `main` una vez que el código haya sido revisado y probado.
- **Revisión de código**: Se realiza una revisión de código por al menos un miembro del equipo antes de fusionar la rama.
- Las ramas se fusionan al tronco principal mediante **pull requests** o **merge requests**, después de ser revisadas por el equipo.

### Flujo de Trabajo:
1. **Crear una nueva rama** para cada funcionalidad o tarea específica.
```bash
git checkout -b feature/nombre-de-la-funcionalidad
```
2. **Hacer commits** frecuentes de los cambios.
```bash
git add .
git commit -m "Descripción del cambio"
```
3. **Abrir un pull request** para revisión de código por otro miembro del equipo.
```bash
git checkout main
```
4. **Integrar la rama** en `main` después de que las pruebas automáticas pasen y el código sea aprobado.
```bash
git merge feature/nombre-de-la-funcionalidad
```
## Estrategia de Despliegue
Para el despliegue del proyecto, se ha seleccionado la estrategia de **Rolling Deployment**, que permite realizar actualizaciones de la aplicación sin tiempos de inactividad.

### Entornos de Despliegue Definidos:
1. **Desarrollo**: Aquí se realizan las primeras pruebas de las funcionalidades iniciales y desarrollo activo.
2. **Staging**: Réplica del entorno de producción donde se realizan las pruebas finales antes del despliegue.
3. **Producción**: El entorno en el que la aplicación está disponible para los usuarios finales.

## Proceso de CI/CD
Se utiliza **Integración Continua (CI)** para asegurar que cada cambio que se integra al tronco principal pase por un proceso automatizado de pruebas. Cuando todas las pruebas pasan, el código se despliega automáticamente en los entornos de **Staging** y posteriormente en **Producción**.

## Instrucciones para Contribuir

1. **Clonar el repositorio**: Esto descargará una copia del código fuente en tu máquina local.
```bash
git clone https://github.com/BERCHNARD10/UTHH_PRY
```
2. **Entrar en el directorio del proyecto**: Accede al directorio clonado donde está el código del proyecto.
```bash
cd UTHH_PRY
```
3. **Instalar dependencias**: Esto instalará todas las dependencias necesarias del proyecto especificadas en package.json.
```bash
npm install
```
4. **Ejecutar el proyecto en modo desarrollo**: Inicia el servidor en modo desarrollo. Esto te permitirá ver la aplicación en tiempo real y se recargará automáticamente cuando realices cambios en el código.
```bash
npm run dev
```
5. **Ejecutar las pruebas**: Corre las pruebas automatizadas del proyecto para asegurarse de que todo funcione correctamente.
```bash
npm run test
```
# Issues y Tareas por Sprint

## Sprint 1 - Planificación
| **Descripción del Issue**                                   | **Responsable** | **Fecha de Inicio** | **Fecha de Fin** | **Sprint** | **Estado** |
|-------------------------------------------------------------|-----------------|---------------------|------------------|------------|------------|
| Investigación y Selección de la Pasarela de Pagos            | RA              | 29/09/2024          | 04/10/2024       | Sprint 1   | En progreso|
| Definir Qué Partes Estarán Disponibles sin Conexión          | BA              | 01/10/2024          | 05/10/2024       | Sprint 1   | Pendiente  |

## Sprint 2 - Diseño Responsivo
| **Descripción del Issue**                                   | **Responsable** | **Fecha de Inicio** | **Fecha de Fin** | **Sprint** | **Estado** |
|-------------------------------------------------------------|-----------------|---------------------|------------------|------------|------------|
| Diseño Responsivo para Móviles y Tablets con Pruebas         | BA              | 01/09/2024          | 14/09/2024       | Sprint 2   | Completado |
| Optimización de Elementos para Pantallas Grandes             | RA & BA           | 15/09/2024          | 25/09/2024       | Sprint 2   | Completado |
| Pruebas de Responsividad en Múltiples Dispositivos           | RA & BA           | 27/09/2024          | 30/09/2024       | Sprint 2   | En progreso|
| Interfaz para Gestión de Notificaciones en el Frontend          | RA & BA           | 30/09/2024          | 05/10/2024       | Sprint 2   | En progreso|

## Sprint 3 - Notificaciones Push y en Tiempo Real
| **Descripción del Issue**                                   | **Responsable** | **Fecha de Inicio** | **Fecha de Fin** | **Sprint** | **Estado** |
|-------------------------------------------------------------|-----------------|---------------------|------------------|------------|------------|
| Configuración del Backend para Notificaciones Push           | RA              | 28/09/2024          | 04/10/2024       | Sprint 3   | En progreso|
| Redirección de Notificaciones en la Aplicación               | BA              | 06/10/2024          | 11/10/2024       | Sprint 3   | Pendiente  |
| Pruebas de Notificaciones en Diferentes Dispositivos         | RA              | 12/10/2024          | 14/10/2024       | Sprint 3   | Pendiente  |

## Sprint 4 - Funcionalidad Offline y PWA
| **Descripción del Issue**                                   | **Responsable** | **Fecha de Inicio** | **Fecha de Fin** | **Sprint** | **Estado** |
|-------------------------------------------------------------|-----------------|---------------------|------------------|------------|------------|
| Implementar Instalación de la PWA                           | RA              | 16/10/2024          | 21/10/2024       | Sprint 4   | Pendiente  |
| Implementación de Service Workers para Cache y IndexedDB    | RA & BH           | 18/10/2024          | 21/10/2024       | Sprint 4   | Pendiente  |
| Sincronización de Datos al Recuperar la Conexión            | RA              | 22/10/2024          | 26/10/2024       | Sprint 4   | Pendiente  |
| Pruebas del Modo Offline                                    | RA  & BH          | 22/10/2024          | 30/10/2024       | Sprint 4   | Pendiente  |

## Sprint 5 - Pasarela de Pagos Segura
| **Descripción del Issue**                                   | **Responsable** | **Fecha de Inicio** | **Fecha de Fin** | **Sprint** | **Estado** |
|-------------------------------------------------------------|-----------------|---------------------|------------------|------------|------------|
| Implementación de la Pasarela en el Backend                 | RA              | 01/11/2024          | 08/11/2024       | Sprint 5   | Pendiente  |
| Desarrollo del Frontend para la Pasarela de Pagos            | BA              | 01/11/2024          | 08/11/2024       | Sprint 5   | Pendiente  |
| Pruebas de la Pasarela de Pagos y Manejo de Errores         | RA & BH          | 09/11/2024          | 11/11/2024       | Sprint 5   | Pendiente  |

## Sprint 6 - Sistema de Suscripciones
| **Descripción del Issue**                                   | **Responsable** | **Fecha de Inicio** | **Fecha de Fin** | **Sprint** | **Estado** |
|-------------------------------------------------------------|-----------------|---------------------|------------------|------------|------------|
| Desarrollo del Backend para los Planes de Suscripción        | RA              | 12/11/2024          | 16/11/2024       | Sprint 6   | Pendiente  |
| Manejo de Renovaciones y Cancelaciones Automáticas           | RA & BH          | 17/11/2024          | 22/11/2024       | Sprint 6   | Pendiente  |
| Pruebas de Renovaciones y Cancelaciones                     | RA   BH        | 23/11/2024          | 30/11/2024       | Sprint 6   | Pendiente  |
