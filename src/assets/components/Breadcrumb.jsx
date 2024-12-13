import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { AuthProvider, useAuth } from '../server/authUser';

const BreadcrumbNav = () => {
    const { isAuthenticated, userData } = useAuth();
    const location = useLocation();
    const {matricula,  token, vchClvMateria, chrGrupo, intPeriodo, intNumeroActi, intNumeroPractica, intIdActividadCurso } = useParams();
    
    const getBreadcrumbs = () => {
        const path = location.pathname;
        const breadcrumbs = [];


        // Conditional paths
        if (path.includes('/mi-perfil')) {
            breadcrumbs.push({ path: '/mi-perfil', alias: 'Mi Perfil' });
        }
        if (path.includes(`/restablecer-contrasena/${matricula}/${token}`)) {
            breadcrumbs.push({ path: `/restablecer-contrasena/${matricula}/${token}`, alias: 'Restablecer Contraseña' });
        }
        if (path.includes('/recuperar-contrasena')) {
            breadcrumbs.push({ path: '/recuperar-contrasena', alias: 'Recuperar Contraseña' });
        }
        
        if (path.includes('/Terminos')) {
            breadcrumbs.push({ path: '/Terminos', alias: 'Terminos y Condiciones' });
        }

        if (isAuthenticated && !userData.intRol) {

            if (path.includes(`/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`)) {
                breadcrumbs.push({ path: `/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
            }
            
            if (path.includes(`/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intIdActividadCurso}`)) {
                breadcrumbs.push({ path: `/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
                breadcrumbs.push({ path: `/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intIdActividadCurso}`, alias: 'Detalle de la Actividad' });
            }

            if (path.includes(`/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intNumeroPractica}/${intIdActividadCurso}`)) {
                breadcrumbs.push({ path: `/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
                breadcrumbs.push({ path: `/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intIdActividadCurso}`, alias: 'Detalle de la Actividad' });
                breadcrumbs.push({ path: `/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intNumeroPractica}/${intIdActividadCurso}`, alias: 'Detalle de la Practica' });
            }
        }
        if (isAuthenticated && userData.intRol) {

            //Docentes
            if (path.includes(`/alumnos`)) {
                breadcrumbs.push({ path: `/alumnos`, alias: 'Alumnos' });
            }
            if (path.includes(`/docentes`)) {
                breadcrumbs.push({ path: `/docentes`, alias: 'Docentes' });
            }
            if (path.includes('/carreras')) {
                breadcrumbs.push({ path: '/carreras', alias: 'Carreras' });
            }
            if (path.includes('/periodos')) {
                breadcrumbs.push({ path: '/periodos', alias: 'Periodos' });
            }
            
            if (path.includes('/departamentos')) {
                breadcrumbs.push({ path: '/departamentos', alias: 'Departamentos' });
            }
            if (path.includes(`/gruposMaterias/${vchClvMateria}/${intPeriodo}`)) {
                breadcrumbs.push({ path: `/gruposMaterias/${vchClvMateria}/${intPeriodo}`, alias: 'Grupos' });
            }
            if (path.includes(`/gruposMaterias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`)) {
                breadcrumbs.push({ path: `/gruposMaterias/${vchClvMateria}/${intPeriodo}`, alias: 'Grupos' });
                breadcrumbs.push({ path: `/gruposMaterias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
            }
            if (path.includes(`/gruposMaterias/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intIdActividadCurso}`)) {
                breadcrumbs.push({ path: `/gruposMaterias/${vchClvMateria}/${intPeriodo}`, alias: 'Grupos' });
                breadcrumbs.push({ path: `/gruposMaterias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
                breadcrumbs.push({ path: `/gruposMaterias/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intIdActividadCurso}`, alias: 'Detalle de la Actividad' });
            }
            if (path.includes(`/gruposMaterias/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intNumeroPractica}/${intIdActividadCurso}`)) {
                breadcrumbs.push({ path: `/gruposMaterias/${vchClvMateria}/${intPeriodo}`, alias: 'Grupos' });
                breadcrumbs.push({ path: `/gruposMaterias/actividades/${vchClvMateria}/${chrGrupo}/${intPeriodo}`, alias: 'Actividades' });
                breadcrumbs.push({ path: `/gruposMaterias/actividades/detalleActividad/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intIdActividadCurso}`, alias: 'Detalle de la Actividad' });
                breadcrumbs.push({ path: `/gruposMaterias/actividades/detalleActividad/detallePractica/${vchClvMateria}/${chrGrupo}/${intPeriodo}/${intNumeroActi}/${intNumeroPractica}/${intIdActividadCurso}`, alias: 'Detalle de la Practica' });
            }
            
        }        
        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className='container mx-auto pt-20 pb-6'>

        <Breadcrumb aria-label="Breadcrumb">
            <Breadcrumb.Item icon={HiHome}>
                <Link to="/">Inicio</Link>
            </Breadcrumb.Item>
            {breadcrumbs.map((breadcrumb, index) => (
                <Breadcrumb.Item key={index}>
                    <Link to={breadcrumb.path}>{breadcrumb.alias}</Link>
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
        </div>
    );
};

export default BreadcrumbNav;
