-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 18-12-2024 a las 17:43:48
-- Versión del servidor: 10.11.10-MariaDB
-- Versión de PHP: 7.2.34

START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u316023526_uthhvirtualdat`
--
CREATE DATABASE IF NOT EXISTS `u316023526_uthhvirtualdat` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE u316023526_uthhvirtualdat;

DELIMITER $$
--
-- Procedimientos
--
CREATE  PROCEDURE `actualizarPassword` (IN `p_matricula` VARCHAR(10), IN `p_contrasena` VARCHAR(255))   BEGIN
    DECLARE contrasena_actualizada BOOLEAN DEFAULT false;

    -- Intentar actualizar la contraseña en tblalumnos
    UPDATE tblalumnos 
    SET vchPassword = p_contrasena, 
        vchRecovery_token = NULL, 
        dtmRecovery_token_expire = NULL
    WHERE vchMatricula = p_matricula;

    -- Verificar si se actualizó alguna fila en tblalumnos
    IF ROW_COUNT() > 0 THEN
        SET contrasena_actualizada = true;
    ELSE
        -- Si no se actualizó ninguna fila, intentar actualizar en tbldocentes
        UPDATE tbldocentes 
        SET vchPassword = p_contrasena, 
            vchRecovery_token = NULL, 
            dtmRecovery_token_expire = NULL
        WHERE vchMatricula = p_matricula;
        
        -- Verificar si se actualizó alguna fila en tbldocentes
        IF ROW_COUNT() > 0 THEN
            SET contrasena_actualizada = true;
        END IF;
    END IF;

    -- Devolver el resultado
    IF contrasena_actualizada THEN
        SELECT true AS resultado;
    ELSE
        SELECT false AS resultado;
    END IF;

END$$

CREATE  PROCEDURE `actualizarPractica` (IN `p_idPractica` INT, IN `p_vchNombre` VARCHAR(255), IN `p_vchDescripcion` VARCHAR(255), IN `p_vchInstrucciones` LONGTEXT, IN `p_dtmFechaSolicitud` DATETIME, IN `p_dtmFechaEntrega` DATETIME)   BEGIN
    UPDATE `tblpracticas`
    SET 
        `vchNombre` = p_vchNombre,
        `vchDescripcion` = p_vchDescripcion,
        `vchInstrucciones` = p_vchInstrucciones,
        `dtmFechaSolicitud` = p_dtmFechaSolicitud,
        `dtmFechaEntrega` = p_dtmFechaEntrega
    WHERE `idPractica` = p_idPractica;
END$$

CREATE  PROCEDURE `actualizarTokenRecuperacion` (IN `p_email` VARCHAR(255), IN `p_token` VARCHAR(255), IN `p_expiration` DATETIME)   BEGIN
    -- Intentar actualizar el token en tblalumnos
    UPDATE tblalumnos 
    SET vchRecovery_token = p_token, dtmRecovery_token_expire = p_expiration 
    WHERE vchEmail = p_email;

    -- Verificar si se actualizó alguna fila en tblalumnos
    IF ROW_COUNT() = 0 THEN
        -- Si no se actualizó ninguna fila, intentar actualizar en tbldocentes
        UPDATE tbldocentes 
        SET vchRecovery_token = p_token, dtmRecovery_token_expire = p_expiration 
        WHERE vchEmail = p_email;
        
        -- Verificar si se actualizó alguna fila en tbldocentes
        IF ROW_COUNT() = 0 THEN
            -- Si no se actualizó ninguna fila en tbldocentes, significa que el correo electrónico no se encontró
            SELECT 'Correo electrónico no encontrado' AS mensaje;
        ELSE
            -- El token se actualizó en tbldocentes
            SELECT 'Token de recuperación actualizado para docente' AS mensaje;
        END IF;
    ELSE
        -- El token se actualizó en tblalumnos
        SELECT 'Token de recuperación actualizado para alumno' AS mensaje;
    END IF;
END$$

CREATE  PROCEDURE `agregarPeriodoAutomatico` ()   BEGIN
    DECLARE periodo_actual VARCHAR(8);
    DECLARE mes INT;
    DECLARE año INT;
    
    -- Obtener el mes y año actual
    SET mes = MONTH(CURDATE());
    SET año = YEAR(CURDATE());
    
    -- Determinar el periodo actual basado en el mes
    IF mes >= 1 AND mes <= 4 THEN
        SET periodo_actual = CONCAT(año, '1');
    ELSEIF mes >= 5 AND mes <= 8 THEN
        SET periodo_actual = CONCAT(año, '2');
    ELSE
        SET periodo_actual = CONCAT(año, '3');
    END IF;

    -- Verificar si el periodo ya existe en la tabla
    IF NOT EXISTS (SELECT 1 FROM tblperiodo WHERE vchPeriodo = periodo_actual) THEN
        -- Insertar el nuevo periodo en la tabla
        INSERT INTO tblperiodo (vchPeriodo)
        VALUES (periodo_actual);
    END IF;

END$$

CREATE  PROCEDURE `cambiarContraUsuario` (IN `p_matricula` VARCHAR(20), IN `p_passwordActual` VARCHAR(255), IN `p_passwordNuevo` VARCHAR(255))   BEGIN
    DECLARE v_passwordAlmacenada VARCHAR(255);
    DECLARE v_tabla INT DEFAULT 0;

    -- Buscar la contraseña en la tabla tblalumnos
    SELECT vchPassword INTO v_passwordAlmacenada
    FROM tblalumnos
    WHERE vchMatricula = p_matricula;

    IF v_passwordAlmacenada IS NULL THEN
        -- Si no se encuentra en tblalumnos, buscar en tbldocentes
        SELECT vchPassword INTO v_passwordAlmacenada
        FROM tbldocentes
        WHERE vchMatricula = p_matricula;

        SET v_tabla = 1; -- Indicar que la contraseña fue encontrada en tbldocentes
    END IF;

    IF v_passwordAlmacenada IS NOT NULL THEN
        IF v_passwordAlmacenada = p_passwordActual THEN
            IF v_tabla = 0 THEN
                -- Actualizar la contraseña en tblalumnos
                UPDATE tblalumnos
                SET vchPassword = p_passwordNuevo
                WHERE vchMatricula = p_matricula;
            ELSE
                -- Actualizar la contraseña en tbldocentes
                UPDATE tbldocentes
                SET vchPassword = p_passwordNuevo
                WHERE vchMatricula = p_matricula;
            END IF;

            SELECT TRUE AS done, 'Contraseña cambiada exitosamente' AS message;
        ELSE
            SELECT FALSE AS done, 'Contraseña actual incorrecta' AS message;
        END IF;
    ELSE
        SELECT FALSE AS done, 'Usuario no encontrado' AS message;
    END IF;
END$$

CREATE  PROCEDURE `eliminarPracticaActividadCurso` (IN `p_idPractica` INT)   BEGIN
    -- Eliminar las calificaciones de los criterios de la rúbrica asociadas a la práctica
    DELETE FROM tbldetallecalificacioncriterio
    WHERE intIdDetalle IN (
        SELECT intIdDetalle 
        FROM tbldetalleinstrumento 
        WHERE intClvPractica = p_idPractica
    );

    -- Eliminar los detalles del instrumento asociados a la práctica
    DELETE FROM tbldetalleinstrumento
    WHERE intClvPractica = p_idPractica;

    -- Eliminar las calificaciones de la práctica
    DELETE FROM tblcalificacionpractica
    WHERE intClvPractica = p_idPractica;

    -- Eliminar la práctica
    DELETE FROM tblpracticas
    WHERE idPractica = p_idPractica;

END$$

CREATE  PROCEDURE `insertarActividadCurso` (IN `p_intPeriodo` INT, IN `p_intMateria` VARCHAR(10), IN `p_intDocente` VARCHAR(10), IN `p_chrGrupo` CHAR(1), IN `p_intClvCuatrimestre` INT, IN `p_intParcial` INT, IN `p_intNumeroActi` INT, IN `p_intClvCarrera` INT, IN `p_intClvActividad` INT)   BEGIN
    -- Insertar datos en la tabla
    INSERT INTO tblactvidadcurso (
        intPeriodo,
        intMateria,
        intDocente,
        chrGrupo,
        intClvCuatrimestre,
        intParcial,
        intNumeroActi,
        intClvCarrera,
        intClvActividad
    ) VALUES (
        p_intPeriodo,
        p_intMateria,
        p_intDocente,
        p_chrGrupo,
        p_intClvCuatrimestre,
        p_intParcial,
        p_intNumeroActi,
        p_intClvCarrera,
        p_intClvActividad
    );
END$$

CREATE  PROCEDURE `insertarActividadGlobal` (IN `p_vchNomActivi` VARCHAR(255), IN `p_vchDescripcion` VARCHAR(255), IN `p_fltValor` FLOAT, IN `p_dtmFechaSolicitud` DATETIME, IN `p_dtmFechaEntrega` DATETIME, IN `p_vchClvInstrumento` VARCHAR(11), IN `p_vchTiempoEstima` VARCHAR(45), IN `p_enumModalidad` ENUM('Individual','Colaborativa'), OUT `p_lastId` INT)   BEGIN
    INSERT INTO tblactividadesglobales (
        vchNomActivi,
        vchDescripcion,
        fltValor,
        dtmFechaSolicitud,
        dtmFechaEntrega,
        vchClvInstrumento,
        vchTiempoEstima,
        enumModalidad    
    ) VALUES (
        p_vchNomActivi,
        p_vchDescripcion,
        p_fltValor,
        p_dtmFechaSolicitud,
        p_dtmFechaEntrega,
        p_vchClvInstrumento,
        p_vchTiempoEstima,
        p_enumModalidad
    );
    -- Obtener el ID de la última fila insertada
    SET p_lastId = LAST_INSERT_ID();
END$$

CREATE  PROCEDURE `insertarOActualizarCalificacionPractica` (IN `p_intClvPractica` INT, IN `p_intCalificacion` FLOAT, IN `p_vchMatricula` VARCHAR(10))   BEGIN
    INSERT INTO tblcalificacionpractica (intidCalificacionPractica, intClvPractica, intCalificación, vchMatricula)
    VALUES (NULL, p_intClvPractica, p_intCalificacion, p_vchMatricula)
    ON DUPLICATE KEY UPDATE
    intCalificación = VALUES(intCalificación);
END$$

CREATE  PROCEDURE `insertarOActualizarCalificacionRubrica` (IN `p_intIdDetalle` INT, IN `p_vchMatriculaAlumno` VARCHAR(10), IN `p_intCalificacionCriterioObtenida` FLOAT)   BEGIN
    INSERT INTO tbldetallecalificacioncriterio (intIdDetalle, vchMatriculaAlumno, intCalificacionCriterioObtenida)
    VALUES (p_intIdDetalle, p_vchMatriculaAlumno, p_intCalificacionCriterioObtenida)
    ON DUPLICATE KEY UPDATE
    intCalificacionCriterioObtenida = VALUES(intCalificacionCriterioObtenida);
END$$

CREATE  PROCEDURE `obtenerActividadesAlumno` (IN `p_intClvCarrera` INT, IN `p_intMateria` VARCHAR(10), IN `p_intPeriodo` INT, IN `p_intClvCuatrimestre` INT, IN `p_chrGrupo` CHAR(1))   BEGIN
    SELECT 
        ag.intClvActividad, 
        ag.vchNomActivi, 
        ag.vchDescripcion, 
        ag.fltValor, 
        ac.intParcial, 
        ac.intIdActividadCurso
    FROM tblactvidadcurso ac
    JOIN tblactividadesglobales ag 
        ON ac.intClvActividad = ag.intClvActividad
    WHERE ac.intClvCarrera = p_intClvCarrera
        AND ac.intMateria = p_intMateria
        AND ac.intPeriodo = p_intPeriodo
        AND ac.intClvCuatrimestre = p_intClvCuatrimestre
        AND ac.chrGrupo = p_chrGrupo;
END$$

CREATE  PROCEDURE `obtenerActividadesCurso` (IN `materiaId` VARCHAR(10), IN `docenteId` VARCHAR(10), IN `grupo` CHAR(1), IN `periodoId` INT)   BEGIN
    SELECT 
        ac.intIdActividadCurso, 
        ag.intClvActividad, 
        ag.vchNomActivi, 
        ag.vchDescripcion, 
        ag.fltValor, 
        ac.intParcial
    FROM tblactvidadcurso ac
    JOIN tblactividadesglobales ag 
        ON ac.intClvActividad = ag.intClvActividad
    WHERE ac.intMateria = materiaId
      AND ac.intDocente = docenteId
      AND ac.chrGrupo = grupo
      AND ac.intPeriodo = periodoId
      ORDER BY ag.vchNomActivi;
END$$

CREATE  PROCEDURE `obtenerAlumnosCalificacionRubrica` (IN `p_intClvPractica` INT, IN `p_intMateria` INT, IN `p_chrGrupo` CHAR(1), IN `p_intPeriodo` INT, IN `p_intDocente` INT)   BEGIN
    SELECT a.vchFotoPerfil AS FotoPerfil,
    	   a.vchMatricula AS AlumnoMatricula,
           a.vchNombre AS AlumnoNombre,
           a.vchAPaterno AS AlumnoApellidoPaterno,
           a.vchAMaterno AS AlumnoApellidoMaterno,
           a.vchTokenFirebase AS TokenFirebase,
           a.vchTokenExpo AS TokenExpo,
           EXISTS(SELECT 1 
                  FROM tbldetallecalificacioncriterio d
                  WHERE d.vchMatriculaAlumno = a.vchMatricula
                  AND d.intIdDetalle IN (SELECT intIdDetalle 
                                         FROM tbldetalleinstrumento 
                                         WHERE intClvPractica = p_intClvPractica)) AS TieneCalificacion
    FROM tblalumnos a
    JOIN tblalumnosinscritos ai ON a.vchMatricula = ai.vchMatricula
    JOIN tblactvidadcurso ac ON ai.intPeriodo = ac.intPeriodo
                               AND ai.intClvCuatrimestre = ac.intClvCuatrimestre
                               AND ai.chrGrupo = ac.chrGrupo
    WHERE ac.intMateria = p_intMateria 
    AND ac.chrGrupo = p_chrGrupo 
    AND ac.intPeriodo = p_intPeriodo 
    AND ac.intDocente = p_intDocente 
    GROUP BY a.vchMatricula 
    ORDER BY a.vchAPaterno;
    
END$$

CREATE  PROCEDURE `ObtenerAlumnosConDocente` (IN `pMateria` VARCHAR(10), IN `pGrupo` CHAR(1), IN `pPeriodo` INT, IN `pMatriculaExcluida` VARCHAR(10))   BEGIN
    SELECT a.vchFotoPerfil AS FotoPerfil,
           a.vchMatricula AS AlumnoMatricula, 
           a.vchAPaterno AS AlumnoApellidoPaterno, 
           a.vchAMaterno AS AlumnoApellidoMaterno, 
           a.vchNombre AS AlumnoNombre, 
           a.vchEmail AS AlumnoEmail, 
           d.vchFotoPerfil AS DocenteFotoPerfil,
           d.vchMatricula AS DocenteMatricula, 
           d.vchAPaterno AS DocenteApellidoPaterno, 
           d.vchAMaterno AS DocenteApellidoMaterno, 
           d.vchNombre AS DocenteNombre, 
           d.vchEmail AS DocenteEmail
    FROM tblalumnos a
    JOIN tblalumnosinscritos ai ON a.vchMatricula = ai.vchMatricula
    JOIN tblactvidadcurso ac ON ai.intPeriodo = ac.intPeriodo
                             AND ai.intClvCuatrimestre = ac.intClvCuatrimestre
                             AND ai.chrGrupo = ac.chrGrupo
    JOIN tbldocentes d ON ac.intDocente = d.vchMatricula
    WHERE ac.intMateria = pMateria
      AND ac.chrGrupo = pGrupo
      AND ac.intPeriodo = pPeriodo
      AND a.vchMatricula NOT IN (pMatriculaExcluida)
    GROUP BY a.vchMatricula, d.vchMatricula
    ORDER BY a.vchAPaterno;
    
END$$

CREATE  PROCEDURE `obtenerAlumnosInscritos` (IN `idPeriodo` INT, IN `idCarrera` INT, IN `grado` INT, IN `grupo` CHAR(1))   BEGIN
    SELECT * 
    FROM tblalumnosinscritos
    INNER JOIN tblalumnos ON tblalumnosinscritos.vchMatricula = tblalumnos.vchMatricula
    WHERE tblalumnosinscritos.intPeriodo = idPeriodo
    AND tblalumnos.intClvCarrera = idCarrera
    AND tblalumnosinscritos.intClvCuatrimestre = grado
    AND tblalumnosinscritos.chrGrupo = grupo;
END$$

CREATE  PROCEDURE `obtenerCalificacionesCriterioRubrica` (IN `p_vchMatriculaAlumno` VARCHAR(10), IN `p_intClvPractica` INT)   BEGIN
    SELECT c.intIdDetalle AS criterioId,
           c.vchDescripcion AS criterioDescripcion,
           c.intValor AS valorMaximo,
           COALESCE(d.intCalificacionCriterioObtenida, null) AS calificacionObtenida
    FROM tbldetalleinstrumento c
    LEFT JOIN tbldetallecalificacioncriterio d
    ON c.intIdDetalle = d.intIdDetalle
    AND d.vchMatriculaAlumno = p_vchMatriculaAlumno
    WHERE c.intClvPractica = p_intClvPractica;
    
END$$

CREATE  PROCEDURE `obtenerCalificacionesPractActAlum` (IN `p_matricula` VARCHAR(20), IN `p_fkActividadGlobal` INT, IN `p_idActividadCurso` INT)   BEGIN
    SELECT
        tblpracticas.idPractica,
        tblpracticas.vchNombre,
        tblpracticas.vchDescripcion,
        tblpracticas.vchInstrucciones,
        tblpracticas.dtmFechaSolicitud,
        tblpracticas.dtmFechaEntrega,
        tblpracticas.fkActividadGlobal,
        COALESCE(SUM(tbldetalleinstrumento.intValor), 0) AS calificacionPractica,
        COALESCE(tblcalificacionpractica.intCalificación, 0) AS calificacionObtenidaAlumno,
        COALESCE(tblcalificacionactividad.intCalificación, 0) AS calificacionActividadAlumno
    FROM
        tblpracticas
    LEFT JOIN
        tblcalificacionpractica ON tblpracticas.idPractica = tblcalificacionpractica.intClvPractica
        AND tblcalificacionpractica.vchMatricula = p_matricula
    LEFT JOIN
        tbldetalleinstrumento ON tblpracticas.idPractica = tbldetalleinstrumento.intClvPractica
    LEFT JOIN
        tblcalificacionactividad ON tblpracticas.intIdActividadCurso = tblcalificacionactividad.intActividadCurso
        AND tblcalificacionactividad.vchMatricula = p_matricula
    WHERE
        tblpracticas.fkActividadGlobal = p_fkActividadGlobal
        AND tblpracticas.intIdActividadCurso = p_idActividadCurso
    GROUP BY
        tblpracticas.idPractica,
        tblpracticas.vchNombre,
        tblpracticas.vchDescripcion,
        tblpracticas.vchInstrucciones,
        tblpracticas.dtmFechaSolicitud,
        tblpracticas.dtmFechaEntrega,
        tblpracticas.fkActividadGlobal,
        tblcalificacionpractica.intCalificación,
        tblcalificacionactividad.intCalificación
    ORDER BY
        tblpracticas.vchNombre;
END$$

CREATE  PROCEDURE `ObtenerDatosPorId` (IN `p_tabla` VARCHAR(64), IN `p_id` INT)   BEGIN
    DECLARE sql_query TEXT;

    -- Construye la consulta dinámica usando el nombre de la tabla y el ID
    SET sql_query = CONCAT('SELECT * FROM ', p_tabla, ' WHERE id = ', p_id);

    -- Prepara y ejecuta la consulta dinámica
    PREPARE stmt FROM @sql_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

CREATE  PROCEDURE `ObtenerDatosUsuario` (IN `matricula` VARCHAR(10))   BEGIN
    DECLARE tipoUsuario VARCHAR(10);

    -- Verificar si la matrícula corresponde a un alumno
    IF EXISTS (SELECT 1 FROM tblalumnosinscritos WHERE vchMatricula = matricula) THEN
        SET tipoUsuario = 'alumno';

        -- Si es un alumno, obtener los datos completos del alumno
        SELECT 
            tblalumnos.vchMatricula,
            tblalumnos.vchAPaterno,
            tblalumnos.vchAMaterno,
            tblalumnos.vchNombre,
            tblalumnos.vchEmail,
            tblalumnos.vchPassword,
            COALESCE(tblalumnos.intTelefono, 0) AS intTelefono,
            tblalumnos.vchRecovery_token,
            COALESCE(tblalumnos.recovery_code, 0) AS recovery_code,
            tblalumnos.dtmRecovery_token_expire,
            tblalumnos.enmEstadoUsuario,
            tblalumnos.enmEstadoCuenta,
            tblalumnos.dtmfechaRegistro,
            tblalumnos.dtmUltimaConexion,
            tblalumnos.dtmregistroUltimaContrasena,
            tblalumnos.intClvCarrera,
            tblalumnos.vchTokenFirebase,
            tblalumnos.vchFotoPerfil,
            JSON_OBJECT(
                'vchMatricula', tblalumnosinscritos.vchMatricula,
                'intPeriodo', tblalumnosinscritos.intPeriodo,
                'vchPeriodo', tblperiodo.vchPeriodo,
                'intClvCuatrimestre', tblalumnosinscritos.intClvCuatrimestre,
                'vchNomCuatri', tblcuatrimestre.vchNomCuatri,
                'intClvCarrera', tblcarrera.intClvCarrera,
                'vchNomCarrera', tblcarrera.vchNomCarrera,
                'chrGrupo', tblalumnosinscritos.chrGrupo,
                'vchFotoPerfil', tblalumnos.vchFotoPerfil
            ) AS dataEstudiante
        FROM 
            tblalumnos
        INNER JOIN 
            tblalumnosinscritos ON tblalumnos.vchMatricula = tblalumnosinscritos.vchMatricula 
        INNER JOIN 
            tblperiodo ON tblalumnosinscritos.intPeriodo = tblperiodo.intIdPeriodo 
        INNER JOIN 
            tblcarrera ON tblalumnos.intClvCarrera = tblcarrera.intClvCarrera 
        INNER JOIN 
            tblcuatrimestre ON tblalumnosinscritos.intClvCuatrimestre = tblcuatrimestre.intClvCuatrimestre
        WHERE 
            tblalumnos.vchMatricula = matricula;

    ELSE
        -- Si no es un alumno, obtener los datos completos del docente
        SELECT 
            tbldocentes.vchMatricula,
            tbldocentes.vchAPaterno,
            tbldocentes.vchAMaterno,
            tbldocentes.vchNombre,
            tbldocentes.vchEmail,
            tbldocentes.vchPassword,
            tbldocentes.intRol,
            0 AS intTelefono, -- Suponiendo que los docentes no tienen teléfono en esta tabla
            tbldocentes.vchRecovery_token,
            0 AS recovery_code, -- Suponiendo que no hay código de recuperación en la tabla de docentes
            tbldocentes.dtmRecovery_token_expire,
            tbldocentes.enmEstadoUsuario,
            tbldocentes.enmEstadoCuenta,
            tbldocentes.dtmfechaRegistro,
            tbldocentes.dtmUltimaConexion,
            tblroles.vchNombreRol,
            tbldepartamento.vchDepartamento,
            NULL AS dtmregistroUltimaContrasena, -- Suponiendo que no se almacena esta fecha para docentes
            NULL AS intClvCarrera, -- Suponiendo que no hay clave de carrera para docentes
            NULL AS vchTokenFirebase, -- Suponiendo que no se almacena token de Firebase para docentes
            tbldocentes.vchFotoPerfil,
            NULL AS dataEstudiante -- Los docentes no tienen datos de estudiante
        FROM 
            tbldocentes 
        INNER JOIN tblroles ON tbldocentes.intRol = tblroles.intIdRol
        INNER JOIN tbldepartamento ON tbldocentes.vchDepartamento = tbldepartamento.IdDepartamento
        WHERE 
            tbldocentes.vchMatricula = matricula;

    END IF;
END$$

CREATE  PROCEDURE `obtenerDetallesActividad` (IN `materiaId` VARCHAR(10), IN `grupo` CHAR(1), IN `periodoId` INT, IN `actividadId` INT)   BEGIN
    SELECT 
        ag.vchNomActivi AS Nombre_Actividad, 
        ag.vchDescripcion AS Descripcion_Actividad, 
        ag.fltValor AS Valor_Actividad,
        ag.dtmFechaSolicitud AS Fecha_Solicitud,
        ag.dtmFechaEntrega AS Fecha_Entrega,
        ag.vchClvInstrumento AS Clave_Instrumento,
        ag.enumModalidad AS Modalidad
    FROM tblactvidadcurso ac
    INNER JOIN tblactividadesglobales ag 
        ON ac.intClvActividad = ag.intClvActividad
    WHERE ac.intMateria = materiaId
      AND ac.chrGrupo = grupo
      AND ac.intPeriodo = periodoId
      AND ag.intClvActividad = actividadId;
END$$

CREATE  PROCEDURE `obtenerGruposMateriaDocente` (IN `materiaId` VARCHAR(10), IN `docenteId` VARCHAR(10), IN `periodoId` INT)   BEGIN
    SELECT DISTINCT 
        ac.chrGrupo
    FROM tblactvidadcurso ac
    WHERE ac.intMateria = materiaId
      AND ac.intDocente = docenteId
      AND ac.intPeriodo = periodoId
    ORDER BY ac.chrGrupo;
END$$

CREATE  PROCEDURE `obtenerInformacionAlumnoDocente` (IN `p_intMateria` INT, IN `p_chrGrupo` CHAR(1), IN `p_intPeriodo` INT, IN `p_intDocente` INT)   BEGIN
    SELECT a.vchFotoPerfil AS FotoPerfil,
    	   a.vchMatricula AS AlumnoMatricula, 
           a.vchAPaterno AS AlumnoApellidoPaterno, 
           a.vchAMaterno AS AlumnoApellidoMaterno, 
           a.vchNombre AS AlumnoNombre, 
           a.vchEmail AS AlumnoEmail, 
           d.vchMatricula AS DocenteMatricula, 
           d.vchAPaterno AS DocenteApellidoPaterno, 
           d.vchAMaterno AS DocenteApellidoMaterno, 
           d.vchNombre AS DocenteNombre, 
           d.vchEmail AS DocenteEmail
    FROM tblalumnos a
    JOIN tblalumnosinscritos ai ON a.vchMatricula = ai.vchMatricula
    JOIN tblactvidadcurso ac ON ai.intPeriodo = ac.intPeriodo
                             AND ai.intClvCuatrimestre = ac.intClvCuatrimestre
                             AND ai.chrGrupo = ac.chrGrupo
    JOIN tbldocentes d ON ac.intDocente = d.vchMatricula
    WHERE ac.intMateria = p_intMateria 
      AND ac.chrGrupo = p_chrGrupo 
      AND ac.intPeriodo = p_intPeriodo 
      AND ac.intDocente = p_intDocente
    GROUP BY a.vchMatricula, d.vchMatricula 
    ORDER BY a.vchAPaterno;
    
END$$

CREATE  PROCEDURE `obtenerMateriasAlumno` (IN `p_vchMatricula` VARCHAR(10))   BEGIN
    SELECT  
        d.vchFotoPerfil,
        d.vchNombre, 
        d.vchAPaterno, 
        d.vchAMaterno, 
        m.vchClvMateria, 
        m.vchNomMateria, 
        m.intHoras,
        ac.intIdActividadCurso,
        ac.intClvCuatrimestre,
        ac.chrGrupo,
        ac.intPeriodo,
        p.vchPeriodo
    FROM tblalumnosinscritos ai 
    INNER JOIN tblactvidadcurso ac 
        ON ai.intClvCuatrimestre = ac.intClvCuatrimestre 
        AND ai.intPeriodo = ac.intPeriodo 
        AND ai.chrGrupo = ac.chrGrupo 
    INNER JOIN tbldocentes d    
        ON ac.intDocente = d.vchMatricula 
    INNER JOIN tblperiodo p  
        ON ac.intPeriodo = p.intIdPeriodo 
    INNER JOIN tblmaterias m      
        ON ac.intMateria = m.vchClvMateria 
    INNER JOIN tblcuatrimestre c
        ON ac.intClvCuatrimestre = c.intClvCuatrimestre
    WHERE ai.vchMatricula = p_vchMatricula 
    GROUP BY m.vchClvMateria;
END$$

CREATE  PROCEDURE `obtenerMateriasDocente` (IN `docenteId` VARCHAR(10))   BEGIN
    SELECT 
        m.vchClvMateria, 
        m.vchNomMateria, 
        ac.intClvCuatrimestre, 
        c.vchNomCuatri AS NombreCuatrimestre, 
        ac.intPeriodo, 
        p.vchPeriodo AS NombrePeriodo, 
        ac.intIdActividadCurso
    FROM tblmaterias m
    JOIN tblactvidadcurso ac 
        ON m.vchClvMateria = ac.intMateria
    JOIN tblcuatrimestre c 
        ON ac.intClvCuatrimestre = c.intClvCuatrimestre
    JOIN tblperiodo p 
        ON ac.intPeriodo = p.intIdPeriodo
    WHERE ac.intDocente = docenteId
    GROUP BY 
        m.vchClvMateria;
END$$

CREATE  PROCEDURE `obtenerPracticaPorId` (IN `idPractica` INT)   BEGIN
    SELECT * 
    FROM tblpracticas 
    WHERE tblpracticas.idPractica = idPractica;
END$$

CREATE  PROCEDURE `obtenerPracticasPorActividadCurso` (IN `fkActividadGlobal` INT, IN `intIdActividadCurso` INT)   BEGIN
    SELECT * 
    FROM tblpracticas 
    WHERE tblpracticas.fkActividadGlobal = fkActividadGlobal
      AND tblpracticas.intIdActividadCurso = intIdActividadCurso
      ORDER BY tblpracticas.vchNombre;
END$$

CREATE  PROCEDURE `obtener_datos_alumno` (IN `matricula` VARCHAR(10))   BEGIN
    SELECT 
        tblalumnosinscritos.vchMatricula,
        tblalumnosinscritos.intPeriodo,
        tblperiodo.vchPeriodo, 
        tblalumnosinscritos.intClvCuatrimestre,
        tblcuatrimestre.vchNomCuatri, 
        tblalumnos.intClvCarrera,
        tblcarrera.vchNomCarrera, 
        tblalumnosinscritos.chrGrupo,
        tblalumnos.vchFotoPerfil
    FROM 
        tblalumnosinscritos 
    INNER JOIN 
        tblalumnos ON tblalumnosinscritos.vchMatricula = tblalumnos.vchMatricula 
    INNER JOIN 
        tblperiodo ON tblalumnosinscritos.intPeriodo = tblperiodo.intIdPeriodo 
    INNER JOIN 
        tblcarrera ON tblalumnos.intClvCarrera = tblcarrera.intClvCarrera 
    INNER JOIN 
        tblcuatrimestre ON tblalumnosinscritos.intClvCuatrimestre = tblcuatrimestre.intClvCuatrimestre
    WHERE 
        tblalumnosinscritos.vchMatricula = matricula;
END$$

CREATE  PROCEDURE `registrarAlumno` (IN `pMatricula` VARCHAR(10), IN `pAPaterno` VARCHAR(255), IN `pAMaterno` VARCHAR(255), IN `pNombre` VARCHAR(255), IN `pEmail` VARCHAR(100), IN `pPassword` VARCHAR(100), IN `pClvCarrera` INT, IN `pPeriodo` INT, IN `pClvCuatrimestre` INT, IN `pGrupo` CHAR(1))   BEGIN
    DECLARE alumnoExistente INT;

    -- Verificar si el alumno ya existe en la tabla tblalumnos
    SELECT COUNT(*) INTO alumnoExistente
    FROM tblalumnos
    WHERE tblalumnos.vchMatricula = pMatricula;

    IF alumnoExistente > 0 THEN
        -- El alumno ya está registrado
        SELECT 0 AS registroExitoso;
    ELSE
        -- Insertar los datos del alumno en tblalumnos
        INSERT INTO tblalumnos (
            vchMatricula, 
            vchAPaterno, 
            vchAMaterno, 
            vchNombre, 
            vchEmail, 
            vchPassword, 
            intClvCarrera
        ) 
        VALUES (
            pMatricula, 
            pAPaterno, 
            pAMaterno, 
            pNombre, 
            pEmail, 
            pPassword, 
            pClvCarrera
        );

        -- Inscribir al alumno en el periodo, cuatrimestre y grupo correspondiente en tblalumnosinscritos
        INSERT INTO tblalumnosinscritos (
            vchMatricula, 
            intPeriodo, 
            intClvCuatrimestre, 
            chrGrupo
        ) 
        VALUES (
            pMatricula, 
            pPeriodo, 
            pClvCuatrimestre, 
            pGrupo
        );

        -- Confirmar el registro del alumno
        SELECT 1 AS registroExitoso;
    END IF;
END$$

CREATE  PROCEDURE `verificarDocenteMateria` (IN `idPeriodo` INT, IN `idMateria` INT, IN `grupo` CHAR(1), IN `idCarrera` INT, IN `idDocente` VARCHAR(10))   BEGIN
    SELECT ac.intDocente, 
           d.vchNombre AS nombreDocente, 
           d.vchAPaterno AS APDocente, 
           d.vchAMaterno AS AMDocente
    FROM tblactvidadcurso ac
    INNER JOIN tbldocentes d ON ac.intDocente = d.vchMatricula
    WHERE ac.intPeriodo = idPeriodo
    AND ac.intMateria = idMateria
    AND ac.chrGrupo = grupo
    AND ac.intClvCarrera = idCarrera
    AND ac.intDocente <> idDocente;
END$$

CREATE  PROCEDURE `verificarSumaCalificaciones` (IN `p_idPeriodo` INT, IN `p_idMateria` VARCHAR(10), IN `p_intParcial` INT, IN `p_intDocente` VARCHAR(10), IN `p_chrGrupo` CHAR(1), IN `p_intCuatrimestre` INT, IN `p_intCarrera` INT, OUT `p_sumaCalificaciones` FLOAT)   BEGIN
    -- Calcular la suma de calificaciones para el parcial considerando los filtros adicionales
    SELECT COALESCE(SUM(fltValor), 0) INTO p_sumaCalificaciones
    FROM tblactividadesglobales
    JOIN tblactvidadcurso ON tblactividadesglobales.intClvActividad = tblactvidadcurso.intClvActividad
    WHERE tblactvidadcurso.intPeriodo = p_idPeriodo
      AND tblactvidadcurso.intMateria = p_idMateria
      AND tblactvidadcurso.intParcial = p_intParcial
      AND tblactvidadcurso.intDocente = p_intDocente
      AND tblactvidadcurso.chrGrupo = p_chrGrupo
      AND tblactvidadcurso.intClvCuatrimestre = p_intCuatrimestre
      AND tblactvidadcurso.intClvCarrera = p_intCarrera;
END$$

--
-- Funciones
--
CREATE  FUNCTION `obtenerPeriodoActual` () RETURNS VARCHAR(8) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci DETERMINISTIC BEGIN
    DECLARE periodo_actual VARCHAR(8);
    DECLARE mes INT;
    DECLARE año INT;
    
    SET mes = MONTH(CURDATE());
    SET año = YEAR(CURDATE());
    
    IF mes >= 1 AND mes <= 4 THEN
        SET periodo_actual = CONCAT(año, '1');
    ELSEIF mes >= 5 AND mes <= 8 THEN
        SET periodo_actual = CONCAT(año, '2');
    ELSE
        SET periodo_actual = CONCAT(año, '3');
    END IF;
    
    RETURN periodo_actual;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `log_triggers`
--

CREATE TABLE `log_triggers` (
  `log_id` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `value` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `log_triggers`
--

INSERT INTO `log_triggers` (`log_id`, `message`, `value`, `created_at`) VALUES
(1, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(2, 'Total de prácticas después de la inserción: 1', 1, '2024-12-05 18:22:47'),
(3, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(4, 'Total de prácticas después de la inserción: 2', 2, '2024-12-05 18:22:47'),
(5, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(6, 'Total de prácticas después de la inserción: 3', 3, '2024-12-05 18:22:47'),
(7, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(8, 'Total de prácticas después de la inserción: 4', 4, '2024-12-05 18:22:47'),
(9, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(10, 'Total de prácticas después de la inserción: 4', 4, '2024-12-05 18:22:47'),
(11, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(12, 'Total de prácticas después de la inserción: 6', 6, '2024-12-05 18:22:47'),
(13, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(14, 'Total de prácticas después de la inserción: 6', 6, '2024-12-05 18:22:47'),
(15, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(16, 'Total de prácticas después de la inserción: 8', 8, '2024-12-05 18:22:47'),
(17, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(18, 'Total de prácticas después de la inserción: 8', 8, '2024-12-05 18:22:47'),
(19, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(20, 'Total de prácticas después de la inserción: 10', 10, '2024-12-05 18:22:47'),
(21, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(22, 'Total de prácticas después de la inserción: 10', 10, '2024-12-05 18:22:47'),
(23, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:22:47'),
(24, 'Total de prácticas después de la inserción: 11', 11, '2024-12-05 18:22:47'),
(25, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:09'),
(26, 'Total de prácticas después de la eliminación: 11', 11, '2024-12-05 18:23:09'),
(27, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:14'),
(28, 'Total de prácticas después de la eliminación: 10', 10, '2024-12-05 18:23:14'),
(29, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:19'),
(30, 'Total de prácticas después de la eliminación: 9', 9, '2024-12-05 18:23:19'),
(31, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:23'),
(32, 'Total de prácticas después de la eliminación: 8', 8, '2024-12-05 18:23:23'),
(33, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:28'),
(34, 'Total de prácticas después de la eliminación: 7', 7, '2024-12-05 18:23:28'),
(35, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:32'),
(36, 'Total de prácticas después de la eliminación: 6', 6, '2024-12-05 18:23:32'),
(37, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:36'),
(38, 'Total de prácticas después de la eliminación: 5', 5, '2024-12-05 18:23:36'),
(39, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:41'),
(40, 'Total de prácticas después de la eliminación: 4', 4, '2024-12-05 18:23:41'),
(41, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:23:45'),
(42, 'Total de prácticas después de la eliminación: 3', 3, '2024-12-05 18:23:45'),
(43, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:25:20'),
(44, 'Total de prácticas después de la eliminación: 2', 2, '2024-12-05 18:25:20'),
(45, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:32:05'),
(46, 'Total de prácticas después de la eliminación: 1', 1, '2024-12-05 18:32:05'),
(47, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:32:10'),
(48, 'Total de prácticas después de la eliminación: 0', 0, '2024-12-05 18:32:10'),
(49, 'No se encontraron prácticas, se eliminaron calificaciones para la actividad curso: 415', 0, '2024-12-05 18:32:10'),
(50, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:32:36'),
(51, 'Total de prácticas después de la inserción: 1', 1, '2024-12-05 18:32:36'),
(52, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:32:41'),
(53, 'Total de prácticas después de la inserción: 2', 2, '2024-12-05 18:32:41'),
(54, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:32:42'),
(55, 'Total de prácticas después de la inserción: 3', 3, '2024-12-05 18:32:42'),
(56, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:32:50'),
(57, 'Total de prácticas después de la eliminación: 2', 2, '2024-12-05 18:32:50'),
(58, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:32:55'),
(59, 'Total de prácticas después de la eliminación: 1', 1, '2024-12-05 18:32:55'),
(60, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:35:39'),
(61, 'Total de prácticas después de la eliminación: 0', 0, '2024-12-05 18:35:39'),
(62, 'No se encontraron prácticas, se eliminaron calificaciones para la actividad curso: 415', 0, '2024-12-05 18:35:39'),
(63, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:37:37'),
(64, 'Total de prácticas después de la inserción: 1', 1, '2024-12-05 18:37:37'),
(65, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:37:37'),
(66, 'Total de prácticas después de la inserción: 2', 2, '2024-12-05 18:37:37'),
(67, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:37:37'),
(68, 'Total de prácticas después de la inserción: 3', 3, '2024-12-05 18:37:37'),
(69, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:37:37'),
(70, 'Total de prácticas después de la inserción: 4', 4, '2024-12-05 18:37:37'),
(71, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:37:37'),
(72, 'Total de prácticas después de la inserción: 5', 5, '2024-12-05 18:37:37'),
(73, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 18:37:37'),
(74, 'Total de prácticas después de la inserción: 6', 6, '2024-12-05 18:37:37'),
(75, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:37:58'),
(76, 'Total de prácticas después de la inserción: 1', 1, '2024-12-05 19:37:58'),
(77, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:49:36'),
(78, 'Total de prácticas después de la eliminación: 5', 5, '2024-12-05 19:49:36'),
(79, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:49:42'),
(80, 'Total de prácticas después de la eliminación: 4', 4, '2024-12-05 19:49:42'),
(81, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:49:46'),
(82, 'Total de prácticas después de la eliminación: 3', 3, '2024-12-05 19:49:46'),
(83, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:49:50'),
(84, 'Total de prácticas después de la eliminación: 2', 2, '2024-12-05 19:49:50'),
(85, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:49:54'),
(86, 'Total de prácticas después de la eliminación: 1', 1, '2024-12-05 19:49:54'),
(87, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:49:58'),
(88, 'Total de prácticas después de la eliminación: 0', 0, '2024-12-05 19:49:58'),
(89, 'No se encontraron prácticas, se eliminaron calificaciones para la actividad curso: 415', 0, '2024-12-05 19:49:58'),
(90, 'Valor de la actividad global obtenido: 5', 5, '2024-12-05 19:50:08'),
(91, 'Total de prácticas después de la eliminación: 0', 0, '2024-12-05 19:50:08'),
(92, 'No se encontraron prácticas, se eliminaron calificaciones para la actividad curso: 416', 0, '2024-12-05 19:50:08'),
(93, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 20:39:23'),
(94, 'Total de prácticas después de la inserción: 1', 1, '2024-12-15 20:39:23'),
(95, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 20:47:27'),
(96, 'Total de prácticas después de la inserción: 2', 2, '2024-12-15 20:47:27'),
(97, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 20:49:26'),
(98, 'Total de prácticas después de la inserción: 3', 3, '2024-12-15 20:49:26'),
(99, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:09:45'),
(100, 'Total de prácticas después de la inserción: 4', 4, '2024-12-15 21:09:45'),
(101, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:09:57'),
(102, 'Total de prácticas después de la inserción: 5', 5, '2024-12-15 21:09:57'),
(103, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:10:04'),
(104, 'Total de prácticas después de la eliminación: 4', 4, '2024-12-15 21:10:04'),
(105, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:12:10'),
(106, 'Total de prácticas después de la inserción: 5', 5, '2024-12-15 21:12:10'),
(107, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:16:27'),
(108, 'Total de prácticas después de la inserción: 6', 6, '2024-12-15 21:16:27'),
(109, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:17:49'),
(110, 'Total de prácticas después de la inserción: 7', 7, '2024-12-15 21:17:49'),
(111, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:27:23'),
(112, 'Total de prácticas después de la eliminación: 6', 6, '2024-12-15 21:27:23'),
(113, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:27:31'),
(114, 'Total de prácticas después de la eliminación: 5', 5, '2024-12-15 21:27:31'),
(115, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:34:00'),
(116, 'Total de prácticas después de la inserción: 6', 6, '2024-12-15 21:34:00'),
(117, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:34:42'),
(118, 'Total de prácticas después de la inserción: 7', 7, '2024-12-15 21:34:42'),
(119, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:34:42'),
(120, 'Total de prácticas después de la inserción: 8', 8, '2024-12-15 21:34:42'),
(121, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:34:42'),
(122, 'Total de prácticas después de la inserción: 9', 9, '2024-12-15 21:34:42'),
(123, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:41:10'),
(124, 'Total de prácticas después de la eliminación: 8', 8, '2024-12-15 21:41:10'),
(125, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:41:15'),
(126, 'Total de prácticas después de la eliminación: 7', 7, '2024-12-15 21:41:15'),
(127, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:41:19'),
(128, 'Total de prácticas después de la eliminación: 6', 6, '2024-12-15 21:41:19'),
(129, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:41:24'),
(130, 'Total de prácticas después de la eliminación: 5', 5, '2024-12-15 21:41:24'),
(131, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:41:28'),
(132, 'Total de prácticas después de la eliminación: 4', 4, '2024-12-15 21:41:28'),
(133, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:41:32'),
(134, 'Total de prácticas después de la eliminación: 3', 3, '2024-12-15 21:41:32'),
(135, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:41:43'),
(136, 'Total de prácticas después de la eliminación: 2', 2, '2024-12-15 21:41:43'),
(137, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:42:18'),
(138, 'Total de prácticas después de la inserción: 3', 3, '2024-12-15 21:42:18'),
(139, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:42:18'),
(140, 'Total de prácticas después de la inserción: 4', 4, '2024-12-15 21:42:18'),
(141, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:45:46'),
(142, 'Total de prácticas después de la eliminación: 3', 3, '2024-12-15 21:45:46'),
(143, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:45:49'),
(144, 'Total de prácticas después de la eliminación: 2', 2, '2024-12-15 21:45:49'),
(145, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:46:10'),
(146, 'Total de prácticas después de la inserción: 3', 3, '2024-12-15 21:46:10'),
(147, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:46:10'),
(148, 'Total de prácticas después de la inserción: 4', 4, '2024-12-15 21:46:10'),
(149, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:47:10'),
(150, 'Total de prácticas después de la inserción: 5', 5, '2024-12-15 21:47:10'),
(151, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:47:10'),
(152, 'Total de prácticas después de la inserción: 6', 6, '2024-12-15 21:47:10'),
(153, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:57:21'),
(154, 'Total de prácticas después de la inserción: 7', 7, '2024-12-15 21:57:21'),
(155, 'Valor de la actividad global obtenido: 3', 3, '2024-12-15 21:57:31'),
(156, 'Total de prácticas después de la eliminación: 6', 6, '2024-12-15 21:57:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Notificaciones`
--

CREATE TABLE `Notificaciones` (
  `intClvNotification` int(11) NOT NULL,
  `vchMatricula` varchar(10) DEFAULT NULL,
  `vchTipoMensaje` varchar(50) DEFAULT NULL,
  `vchmensaje` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `read` tinyint(1) DEFAULT 0,
  `metadata` longtext DEFAULT NULL CHECK (json_valid(`metadata`)),
  `fechaActualizacion` timestamp NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblactividadesglobales`
--

CREATE TABLE `tblactividadesglobales` (
  `intClvActividad` int(11) NOT NULL,
  `vchNomActivi` varchar(255) NOT NULL,
  `vchDescripcion` varchar(255) NOT NULL,
  `fltValor` float NOT NULL,
  `dtmFechaSolicitud` datetime DEFAULT NULL,
  `dtmFechaEntrega` datetime DEFAULT NULL,
  `vchClvInstrumento` varchar(11) NOT NULL,
  `vchTiempoEstima` varchar(45) DEFAULT NULL,
  `enumModalidad` enum('Individual','Colaborativa') DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `tblactividadesglobales`
--

INSERT INTO `tblactividadesglobales` (`intClvActividad`, `vchNomActivi`, `vchDescripcion`, `fltValor`, `dtmFechaSolicitud`, `dtmFechaEntrega`, `vchClvInstrumento`, `vchTiempoEstima`, `enumModalidad`) VALUES
(215, 'ACTIVIDAD 3: Ejercicios en clase\r\n', 'Haciendo uso de un SGBD el alumno podrá aplicar\r\n• Creación, modificación y eliminación de índices y vistas.\r\n• Elaboración de consultas avanzadas.\r\n- Subconsultas, Filtros, Funciones de agregado.\r\n- Ordenamiento y agrupación.', 3, '1969-12-31 18:00:00', '1969-12-31 18:00:00', 'IE.LCBDA01', '4 horas', 'Individual'),
(216, 'ACTIVIDAD 4: Ejercicio fin de mes: \r\n', 'Haciendo uso de un SGBD el alumno desarrollará una aplicación donde permita visualizar el manejo de:\r\n• Índices y vistas.\r\n• Elaboración de consultas avanzadas ', 4, '1969-12-31 18:00:00', '1969-12-31 18:00:00', 'IE.LCBDA02', '1 horas', 'Colaborativa'),
(217, 'ACTIVIDAD 4: Ejercicio fin de mes: \r\n', 'Haciendo uso de un SGBD el alumno desarrollará una aplicación donde permita visualizar el manejo de:\r\n• Índices y vistas.\r\n• Elaboración de consultas avanzadas ', 3, '1969-12-31 18:00:00', '1969-12-31 18:00:00', 'IE.LCBDA02', '1 horas', 'Colaborativa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblactvidadcurso`
--

CREATE TABLE `tblactvidadcurso` (
  `intIdActividadCurso` int(11) NOT NULL,
  `intPeriodo` int(11) NOT NULL,
  `intMateria` varchar(10) NOT NULL,
  `intDocente` varchar(10) NOT NULL,
  `chrGrupo` char(1) NOT NULL,
  `intClvCuatrimestre` int(11) NOT NULL,
  `intParcial` int(11) NOT NULL,
  `intNumeroActi` int(11) NOT NULL,
  `intClvCarrera` int(11) DEFAULT NULL,
  `intClvActividad` int(11) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `tblactvidadcurso`
--

INSERT INTO `tblactvidadcurso` (`intIdActividadCurso`, `intPeriodo`, `intMateria`, `intDocente`, `chrGrupo`, `intClvCuatrimestre`, `intParcial`, `intNumeroActi`, `intClvCarrera`, `intClvActividad`) VALUES
(417, 8, 'INF137', '0432', 'A', 9, 3, 1, 64, 215),
(418, 8, 'INF137', '0432', 'A', 9, 3, 2, 64, 216),
(419, 8, 'INF137', '0432', 'A', 9, 3, 3, 64, 217);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblalumnos`
--

CREATE TABLE `tblalumnos` (
  `vchMatricula` varchar(10) NOT NULL,
  `vchAPaterno` varchar(255) DEFAULT NULL,
  `vchAMaterno` varchar(255) DEFAULT NULL,
  `vchNombre` varchar(255) DEFAULT NULL,
  `vchEmail` varchar(100) DEFAULT NULL,
  `vchPassword` varchar(100) DEFAULT NULL,
  `intTelefono` int(10) DEFAULT NULL,
  `vchRecovery_token` varchar(255) DEFAULT NULL,
  `recovery_code` int(5) DEFAULT NULL,
  `dtmRecovery_token_expire` datetime DEFAULT NULL,
  `enmEstadoUsuario` enum('activo','baja') NOT NULL DEFAULT 'activo',
  `enmEstadoCuenta` enum('activa','bloqueada') NOT NULL DEFAULT 'activa',
  `dtmfechaRegistro` timestamp NOT NULL DEFAULT current_timestamp(),
  `dtmUltimaConexion` timestamp NULL DEFAULT NULL,
  `dtmregistroUltimaContrasena` timestamp NULL DEFAULT NULL,
  `intClvCarrera` int(11) NOT NULL,
  `vchTokenFirebase` varchar(300) DEFAULT NULL,
  `vchTokenExpo` varchar(250) DEFAULT NULL,
  `vchFotoPerfil` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `tblalumnos`
--

INSERT INTO `tblalumnos` (`vchMatricula`, `vchAPaterno`, `vchAMaterno`, `vchNombre`, `vchEmail`, `vchPassword`, `intTelefono`, `vchRecovery_token`, `recovery_code`, `dtmRecovery_token_expire`, `enmEstadoUsuario`, `enmEstadoCuenta`, `dtmfechaRegistro`, `dtmUltimaConexion`, `dtmregistroUltimaContrasena`, `intClvCarrera`, `vchTokenFirebase`, `vchTokenExpo`, `vchFotoPerfil`) VALUES
('20210693', 'LARIOS  ', 'HERNANDEZ', 'KEVIN YAEL', '20210693@uthh.edu.mx', '5ff4f240bd79d75418d89140bef5e7706b1454029b2ff40b376ccdd82687c61a', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20221019', 'DE LA CRUZ ', 'HERNANDEZ', 'OSCAR DAVID', '20221019@uthh.edu.mx', 'efca08a65b4ae2399418947e53b85044062dfd450364231c114bc91fbc62ea6d', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20221092', 'MEDELLIN  ', 'HERNANDEZ', 'MARIA SALOME', '20221092@uthh.edu.mx', 'db300888f06609f49a4213ab70ebab1cab4e702781ae36c8694a0d29e65178f3', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230004', 'HERNANDEZ ', 'VERA', 'ROGELIO', '20230004@uthh.edu.mx', 'ce950a87fef301f20193e1389d12339cdbfb237d2a465cfed8355519c6a493ec', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230008', 'CASTRO ', 'ROSAS', 'JUAN MANUEL', '20230008@uthh.edu.mx', '293f76477919a083a6b25c43f2bbf1063896588b562c97363e2d0a59ecb5503f', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230012', 'HERNANDEZ', 'ANTONIO', 'MARCIAL', '20230012@uthh.edu.mx', 'd8b52edf6302911ddd5871626a6a4dc1008f43e8a7d8c2347e7b4feef5c75079', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230016', 'HERVERT  ', 'ESPINOZA', 'FATIMA AIDE', '20230016@uthh.edu.mx', '51a3a3a8b706c2586d745a72e463b5ce115f5123277cec5d839a12dd365dbf8c', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230020', 'MARTINEZ  ', 'HERNÁNDEZ', 'ANGEL URIEL', '20230020@uthh.edu.mx', '731ac9b5dbac165f88c89b6cb0ed0f4eb73732df38d1a86394e4384f646e3a94', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230028', 'HERNÁNDEZ  ', 'HERNÁNDEZ', 'LUIS ANGEL', '20230028@uthh.edu.mx', 'e0cf46c78381b692aeb69980130e998b398bb45499abcc3f08b19e5aef15f4e2', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230032', 'FLORES  ', 'VELASQUEZ', 'MAIRA JOSELIN', '20230032@uthh.edu.mx', 'cc196afe01d9f0661dadf638fc184c8ed1e6e9d5a4d69e8eff8bb5cf10a11217', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230040', 'HERNANDEZ ', 'HERNANDEZ', 'MIGUEL ANGEL', '20230040@uthh.edu.mx', 'd84e82a97d9c271d5f8a1ad235cde067aebdf298775968bea5d3440e2c02f6cb', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230052', 'RODRIGUEZ  ', 'CARRILLO', 'ANDRES', '20230052@uthh.edu.mx', '81d29b6ff8b9f9f16a5350cdabd7393c654435cfaf2f04e9347d19f3a3d00ec7', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230060', 'HERNANDEZ ', 'HIPOLITO', 'ALEXIS YAZIR', '20230060@uthh.edu.mx', '9c5eaca2e94cbc06e6bba9f429d3c908f9f3041768bb54b8f259a91dd677e436', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230064', 'HERNANDEZ ', 'RAMOS', 'ALDO JEZRAEL', '20230064@uthh.edu.mx', '6b7453a0a12c0958948447c7e3f6cef7cc36b2291135d3d6f86f4ee700b6550d', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230068', 'OLVERA  ', 'MORALES', 'LIZBET', '20230068@uthh.edu.mx', 'f4a5f61f4e2f5ec76758b3b6aafa77357d3eb961f6b9223c8b1eee8eef11fdbc', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230080', 'HERNANDEZ ', 'SEBASTIAN', 'CECILIA CITLALLI', '20230080@uthh.edu.mx', 'e3151eb28db3e86828ec4d1882d67d45bf6ca417bbe9f57d6348c6a0867a56b8', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230108', 'MATIAS  ', 'VIDAL', 'JOADAN JOSEF', '20230108@uthh.edu.mx', 'cb27b3304034f397ff2f9e4077e7813ece56a2f041f07da7a24b2de61b7e3459', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20230930', 'CAYETANO  ', 'GARCIA', 'JORGE MIGUEL', '20230930@uthh.edu.mx', 'ddc29c36f5a5deebca3e1ef2bdc48e10b77af31c2acc2e7e49a48d225ba36af1', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20231176', 'GONZÁLEZ  ', 'RAMÍREZ', 'ZENAIDA', '20231176@uthh.edu.mx', 'f20565f3544792d8f4da5d9cbbd37645ee0118693b311af82d79fac29a84dff2', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20231188', 'RESENDEZ  ', 'SIERRA', 'CRISTHIAN DAVID', '20231188@uthh.edu.mx', '71f12875723dbb9758f6547886a4a1c805da9bbe35fd3c97c058309a580e850b', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20231212', 'DEL ANGEL ', 'HERNANDEZ', 'LUIS ANGEL', '20231212@uthh.edu.mx', 'f81c16e560c76c177354c01b820abe467be3dc2156125dbcbcd44ebbc23e18ad', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20231335', 'HIDALGO  ', 'TOLEDO', 'CARLOS EDUARDO', '20231335@uthh.edu.mx', '4dd08cefbfac3e343eb5e285db6c083f040a14f57652be172badc8fcb255a2b9', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL),
('20231342', 'CARPIO ', 'LUCIANO', 'JOASIM KALEB', '20231342@uthh.edu.mx', 'ef55af310996d2728a36dd99c300329368ddf92c9ae494dbb3611d2761d30691', 0, NULL, 0, NULL, 'activo', 'activa', '2024-12-09 09:17:10', NULL, '2024-12-09 09:17:10', 64, '', '', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblalumnosinscritos`
--

CREATE TABLE `tblalumnosinscritos` (
  `vchMatricula` varchar(10) NOT NULL,
  `intPeriodo` int(11) NOT NULL,
  `intClvCuatrimestre` int(11) NOT NULL,
  `chrGrupo` char(1) NOT NULL
) ;

--
-- Volcado de datos para la tabla `tblalumnosinscritos`
--

INSERT INTO `tblalumnosinscritos` (`vchMatricula`, `intPeriodo`, `intClvCuatrimestre`, `chrGrupo`) VALUES
('20210693', 8, 9, 'A'),
('20221019', 8, 9, 'A'),
('20221092', 8, 9, 'A'),
('20230004', 8, 9, 'A'),
('20230008', 8, 9, 'A'),
('20230012', 8, 9, 'A'),
('20230016', 8, 9, 'A'),
('20230020', 8, 9, 'A'),
('20230028', 8, 9, 'A'),
('20230032', 8, 9, 'A'),
('20230040', 8, 9, 'A'),
('20230052', 8, 9, 'A'),
('20230060', 8, 9, 'A'),
('20230064', 8, 9, 'A'),
('20230068', 8, 9, 'A'),
('20230080', 8, 9, 'A'),
('20230108', 8, 9, 'A'),
('20230930', 8, 9, 'A'),
('20231176', 8, 9, 'A'),
('20231188', 8, 9, 'A'),
('20231212', 8, 9, 'A'),
('20231335', 8, 9, 'A'),
('20231342', 8, 9, 'A');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblcalificacionactividad`
--

CREATE TABLE `tblcalificacionactividad` (
  `intIdCalificacionAct` int(11) NOT NULL,
  `vchMatricula` varchar(11) NOT NULL,
  `intCalificación` float NOT NULL DEFAULT 0,
  `intActividadCurso` int(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblcalificacionesfinales`
--

CREATE TABLE `tblcalificacionesfinales` (
  `intClvCalificaciones` int(11) NOT NULL,
  `vchMatricula` varchar(10) NOT NULL,
  `vchClvMateria` varchar(10) NOT NULL,
  `vchPeriodo` int(11) DEFAULT NULL,
  `chrGrupo` char(1) DEFAULT NULL,
  `intClvCuatrimestre` int(11) DEFAULT NULL,
  `intPar1` int(11) DEFAULT NULL,
  `intPar2` int(11) DEFAULT NULL,
  `intPar3` int(11) DEFAULT NULL,
  `intPromFinal` float DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblcalificacionpractica`
--

CREATE TABLE `tblcalificacionpractica` (
  `intidCalificacionPractica` int(11) NOT NULL,
  `intClvPractica` int(11) NOT NULL,
  `intCalificación` float NOT NULL DEFAULT 0,
  `vchMatricula` varchar(11) NOT NULL
) ;

--
-- Disparadores `tblcalificacionpractica`
--
DELIMITER $$
CREATE TRIGGER `update_calificacion_actividad_after_insert` AFTER INSERT ON `tblcalificacionpractica` FOR EACH ROW BEGIN
    DECLARE actividad_valor FLOAT;
    DECLARE total_calificaciones FLOAT DEFAULT 0;
    DECLARE total_practicas INT DEFAULT 0;
    DECLARE calificacion_final FLOAT DEFAULT 0;
    DECLARE actividad_global_id INT;
    DECLARE actividad_curso_id INT;

    -- Obtener los valores de fkActividadGlobal e intIdActividadCurso de la práctica actual
    SELECT fkActividadGlobal, intIdActividadCurso INTO actividad_global_id, actividad_curso_id
    FROM tblpracticas
    WHERE idPractica = NEW.intClvPractica;

    -- Obtener el valor de la actividad global
    SELECT fltValor INTO actividad_valor
    FROM tblactividadesglobales
    WHERE intClvActividad = actividad_global_id;

    -- Contar el total de prácticas asociadas a la actividad y al curso
    SELECT COUNT(*) INTO total_practicas
    FROM tblpracticas
    WHERE fkActividadGlobal = actividad_global_id
      AND intIdActividadCurso = actividad_curso_id;

    -- Calcular la puntuación total entregada para la actividad
    SELECT COALESCE(SUM(intCalificación), 0) INTO total_calificaciones
    FROM tblcalificacionpractica
    WHERE intClvPractica IN (
        SELECT idPractica
        FROM tblpracticas
        WHERE fkActividadGlobal = actividad_global_id
          AND intIdActividadCurso = actividad_curso_id
    )
    AND vchMatricula = NEW.vchMatricula;

    -- Calcular la calificación final
    IF total_practicas > 0 THEN
        SET calificacion_final = (total_calificaciones / (total_practicas * 10)) * actividad_valor;
    ELSE
        SET calificacion_final = 0;
    END IF;

    -- Actualizar la tabla de calificación de actividades
    INSERT INTO tblcalificacionactividad (intActividadCurso, vchMatricula, intCalificación)
    VALUES (actividad_curso_id, NEW.vchMatricula, calificacion_final)
    ON DUPLICATE KEY UPDATE intCalificación = calificacion_final;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_calificacion_actividad_after_update` AFTER UPDATE ON `tblcalificacionpractica` FOR EACH ROW BEGIN
    DECLARE actividad_valor FLOAT;
    DECLARE total_calificaciones FLOAT DEFAULT 0;
    DECLARE total_practicas INT DEFAULT 0;
    DECLARE calificacion_final FLOAT DEFAULT 0;
    DECLARE actividad_global_id INT;
    DECLARE actividad_curso_id INT;

    -- Obtener los valores de fkActividadGlobal e intIdActividadCurso de la práctica actual
    SELECT fkActividadGlobal, intIdActividadCurso INTO actividad_global_id, actividad_curso_id
    FROM tblpracticas
    WHERE idPractica = NEW.intClvPractica;

    -- Obtener el valor de la actividad global
    SELECT fltValor INTO actividad_valor
    FROM tblactividadesglobales
    WHERE intClvActividad = actividad_global_id;

    -- Contar el total de prácticas asociadas a la actividad y al curso
    SELECT COUNT(*) INTO total_practicas
    FROM tblpracticas
    WHERE fkActividadGlobal = actividad_global_id
      AND intIdActividadCurso = actividad_curso_id;

    -- Calcular la puntuación total entregada para la actividad
    SELECT COALESCE(SUM(intCalificación), 0) INTO total_calificaciones
    FROM tblcalificacionpractica
    WHERE intClvPractica IN (
        SELECT idPractica
        FROM tblpracticas
        WHERE fkActividadGlobal = actividad_global_id
          AND intIdActividadCurso = actividad_curso_id
    )
    AND vchMatricula = NEW.vchMatricula;

    -- Calcular la calificación final
    IF total_practicas > 0 THEN
        SET calificacion_final = (total_calificaciones / (total_practicas * 10)) * actividad_valor;
    ELSE
        SET calificacion_final = 0;
    END IF;

    -- Actualizar la tabla de calificación de actividades
    INSERT INTO tblcalificacionactividad (intActividadCurso, vchMatricula, intCalificación)
    VALUES (actividad_curso_id, NEW.vchMatricula, calificacion_final)
    ON DUPLICATE KEY UPDATE intCalificación = calificacion_final;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblcarrera`
--

CREATE TABLE `tblcarrera` (
  `intClvCarrera` int(11) NOT NULL,
  `vchNomCarrera` varchar(255) NOT NULL
) ;

--
-- Volcado de datos para la tabla `tblcarrera`
--

INSERT INTO `tblcarrera` (`intClvCarrera`, `vchNomCarrera`) VALUES
(2, 'TÉCNICO SUPERIOR UNIVERSITARIO EN MECÁNICA'),
(5, 'TÉCNICO SUPERIOR UNIVERSITARIO EN TECNOLOGÍA DE ALIMENTOS'),
(7, 'TÉCNICO SUPERIOR UNIVERSITARIO EN AGROBIOTECNOLOGÍA'),
(8, 'TÉCNICO SUPERIOR UNIVERSITARIO EN CONTADURÍA'),
(12, 'TÉCNICO SUPERIOR UNIVERSITARIO EN ADMINISTRACIÓN ÁREA ADMINISTRACIÓN Y EVALUACIÓN DE PROYECTOS'),
(13, 'TÉCNICO SUPERIOR UNIVERSITARIO EN PROCESOS ALIMENTARIOS'),
(15, 'TÉCNICO SUPERIOR UNIVERSITARIO EN DESARROLLO DE NEGOCIOS ÁREA MERCADOTECNIA'),
(17, 'TÉCNICO SUPERIOR UNIVERSITARIO EN GASTRONOMÍA'),
(19, 'TÉCNICO SUPERIOR UNIVERSITARIO EN CONSTRUCCIÓN'),
(20, 'TÉCNICO SUPERIOR UNIVERSITARIO EN MECATRÓNICA ÁREA AUTOMATIZACIÓN'),
(51, 'INGENIERÍA EN BIOTECNOLOGÍA'),
(52, 'INGENIERÍA EN GESTIÓN DE PROYECTOS'),
(53, 'INGENIERÍA EN TECNOLOGÍAS DE LA INFORMACIÓN'),
(54, 'INGENIERÍA EN METAL MECÁNICA'),
(55, 'INGENIERÍA FINANCIERA, FISCAL Y CONTADOR PÚBLICO'),
(56, 'INGENIERÍA EN PROCESOS ALIMENTARIOS'),
(57, 'INGENIERÍA EN DESARROLLO E INNOVACIÓN EMPRESARIAL'),
(58, 'LICENCIATURA EN GASTRONOMÍA'),
(59, 'INGENIERÍA CIVIL'),
(60, 'INGENIERÍA EN MECATRÓNICA'),
(63, 'INGENIERÍA EN AGROBIOTECNOLOGIA'),
(64, 'INGENIERÍA EN DESARROLLO Y GESTIÓN DE SOFTWARE ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblcuatrimestre`
--

CREATE TABLE `tblcuatrimestre` (
  `intClvCuatrimestre` int(11) NOT NULL,
  `vchNomCuatri` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `tblcuatrimestre`
--

INSERT INTO `tblcuatrimestre` (`intClvCuatrimestre`, `vchNomCuatri`) VALUES
(1, '1er. CUATRIMESTRE'),
(2, '2do. CUATRIMESTRE'),
(3, '3er. CUATRIMESTRE'),
(4, '4to. CUATRIMESTRE'),
(5, '5to. CUATRIMESTRE'),
(6, '6to. CUATRIMESTRE'),
(7, '7mo. CUATRIMESTRE'),
(8, '8vo. CUATRIMESTRE'),
(9, '9no. CUATRIMESTRE'),
(10, '10mo. CUATRIMESTRE'),
(11, '11avo. CUATRIMESTRE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbldepartamento`
--

CREATE TABLE `tbldepartamento` (
  `IdDepartamento` int(11) NOT NULL,
  `vchDepartamento` varchar(100) NOT NULL DEFAULT ''
) ;

--
-- Volcado de datos para la tabla `tbldepartamento`
--

INSERT INTO `tbldepartamento` (`IdDepartamento`, `vchDepartamento`) VALUES
(1, 'TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIÓN'),
(2, 'MECANICA'),
(3, 'ADMINISTRACIÓN Y EVALUACIÓN DE PROYECTOS'),
(4, 'AGROBIOTECNOLOGÍA'),
(5, 'TECNOLOGÍA DE ALIMENTOS'),
(6, 'CONTADURÍA'),
(7, 'DESARROLLO DE NEGOCIOS'),
(8, 'GASTRONOMÍA'),
(9, 'CONSTRUCCIÓN'),
(10, 'MECATRÓNICA '),
(11, 'INGENIERÍA EN BIOTECNOLOGÍA'),
(12, 'INGENIERÍA EN GESTIÓN DE PROYECTOS'),
(13, 'INGENIERÍA EN TECNOLOGÍAS DE LA INFORMACIÓN'),
(14, 'INGENIERÍA EN METAL MECÁNICA'),
(15, 'INGENIERÍA FINANCIERA, FISCAL Y CONTADOR PÚBLICO'),
(16, 'INGENIERÍA EN PROCESOS ALIMENTARIOS'),
(17, 'INGENIERÍA EN DESARROLLO E INNOVACIÓN EMPRESARIAL'),
(18, 'INGENIERÍA CIVIL'),
(19, 'INGENIERÍA EN MECATRÓNICA'),
(20, 'INGENIERÍA EN DESARROLLO E INNOVACIÓN INGENIERÍA EN TECNOLOGÍA  AMBIENTAL'),
(21, 'INGENIERÍA EN AGROBIOTECNOLOGIA'),
(22, 'LICENCIATURA EN CONTADURÍA'),
(23, 'LICENCIATURA EN GESTIÓN DE NEGOCIOS Y PROYECTOS'),
(24, 'LICENCIATURA EN INNOVACIÓN DE NEGOCIOS Y MERCADOTECNIA'),
(25, 'INGENIERÍA EN DESARROLLO Y GESTIÓN DE SOFTWARE'),
(26, 'LICENCIATURA EN GESTIÓN DE NEGOCIOS Y PROYECTOS'),
(27, 'LICENCIATURA EN INNOVACIÓN DE NEGOCIOS Y MERCADOTECNIA'),
(28, 'LICENCIATURA EN INNOVACIÓN DE NEGOCIOS Y MERCADOTECNIA'),
(29, 'INGENIERÍA EN DESARROLLO Y GESTIÓN DE SOFTWARE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbldetallecalificacioncriterio`
--

CREATE TABLE `tbldetallecalificacioncriterio` (
  `intIdDetalleCalificacionCriterio` int(11) NOT NULL,
  `intIdDetalle` int(11) NOT NULL,
  `intCalificacionCriterioObtenida` float NOT NULL DEFAULT 0,
  `vchMatriculaAlumno` varchar(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbldetalleinstrumento`
--

CREATE TABLE `tbldetalleinstrumento` (
  `intIdDetalle` int(11) NOT NULL,
  `vchClaveCriterio` varchar(30) NOT NULL,
  `vchCriterio` varchar(30) NOT NULL,
  `vchDescripcion` varchar(250) NOT NULL,
  `intValor` float NOT NULL,
  `intClvPractica` int(11) NOT NULL
) ;

--
-- Volcado de datos para la tabla `tbldetalleinstrumento`
--

INSERT INTO `tbldetalleinstrumento` (`intIdDetalle`, `vchClaveCriterio`, `vchCriterio`, `vchDescripcion`, `intValor`, `intClvPractica`) VALUES
(2204, 'C1', 'Criterio 1', 'Entrada: Especifica correctamente los elementos de entrada involucrados en el problema.', 2, 474),
(2205, 'C2', 'Criterio 2', 'Proceso: Indica de manera precisa los procesos que le dan solución al problema.', 2, 474),
(2206, 'C3', 'Criterio 3', 'Salida: Los datos presentados son acordes al problema planteado.', 2, 474),
(2207, 'C4', 'Criterio 4', 'Codificación: El ejercicio está escrito correctamente sin presentar errores de sintaxis, lógicos y en ejecución.', 2, 474),
(2208, 'C5', 'Criterio 5', 'Entrega: Presenta una solución en el tiempo indicado, limpio, ordenado.', 1, 474),
(2209, 'C6', 'Criterio 6', 'Errores: El ejercicio se entrega sin errores, ni correcciones previas.', 1, 474),
(2210, 'C1', 'Criterio 1', 'Entrada: Especifica correctamente los elementos de entrada involucrados en el problema.', 2, 475),
(2211, 'C2', 'Criterio 2', 'Proceso: Indica de manera precisa los procesos que le dan solución al problema.', 2, 475),
(2212, 'C3', 'Criterio 3', 'Salida: Los datos presentados son acordes al problema planteado.', 2, 475),
(2213, 'C4', 'Criterio 4', 'Codificación: El ejercicio está escrito correctamente sin presentar errores de sintaxis, lógicos y en ejecución.', 2, 475),
(2214, 'C5', 'Criterio 5', 'Entrega: Presenta una solución en el tiempo indicado, limpio, ordenado.', 1, 475),
(2215, 'C6', 'Criterio 6', 'Errores: El ejercicio se entrega sin errores, ni correcciones previas.', 1, 475),
(2288, 'C1', 'Criterio 1', 'Entrada: Especifica correctamente los elementos de entrada involucrados en el problema.', 2, 488),
(2289, 'C2', 'Criterio 2', 'Proceso: Indica de manera precisa los procesos que le dan solución al problema.', 2, 488),
(2290, 'C3', 'Criterio 3', 'Salida: Los datos presentados son acordes al problema planteado.', 2, 488),
(2291, 'C4', 'Criterio 4', 'Codificación: El ejercicio está escrito correctamente sin presentar errores de sintaxis, lógicos y en ejecución.', 2, 488),
(2292, 'C5', 'Criterio 5', 'Entrega: Presenta una solución en el tiempo indicado, limpio, ordenado.', 1, 488),
(2293, 'C6', 'Criterio 6', 'Errores: El ejercicio se entrega sin errores, ni correcciones previas.', 1, 488),
(2294, 'C1', 'Criterio 1', 'Entrada: Especifica correctamente los elementos de entrada involucrados en el problema.', 2, 489),
(2295, 'C2', 'Criterio 2', 'Proceso: Indica de manera precisa los procesos que le dan solución al problema.', 2, 489),
(2296, 'C3', 'Criterio 3', 'Salida: Los datos presentados son acordes al problema planteado.', 2, 489),
(2297, 'C4', 'Criterio 4', 'Codificación: El ejercicio está escrito correctamente sin presentar errores de sintaxis, lógicos y en ejecución.', 2, 489),
(2298, 'C5', 'Criterio 5', 'Entrega: Presenta una solución en el tiempo indicado, limpio, ordenado.', 1, 489),
(2299, 'C6', 'Criterio 6', 'Errores: El ejercicio se entrega sin errores, ni correcciones previas.', 1, 489),
(2300, 'C1', 'Criterio 1', 'Entrada: Especifica correctamente los elementos de entrada involucrados en el problema.', 2, 490),
(2301, 'C2', 'Criterio 2', 'Proceso: Indica de manera precisa los procesos que le dan solución al problema.', 2, 490),
(2302, 'C3', 'Criterio 3', 'Salida: Los datos presentados son acordes al problema planteado.', 2, 490),
(2303, 'C4', 'Criterio 4', 'Codificación: El ejercicio está escrito correctamente sin presentar errores de sintaxis, lógicos y en ejecución.', 2, 490),
(2304, 'C5', 'Criterio 5', 'Entrega: Presenta una solución en el tiempo indicado, limpio, ordenado.', 1, 490),
(2305, 'C6', 'Criterio 6', 'Errores: El ejercicio se entrega sin errores, ni correcciones previas.', 1, 490),
(2306, 'C1', 'Criterio 1', 'Entrada: Especifica correctamente los elementos de entrada involucrados en el problema.', 2, 491),
(2307, 'C2', 'Criterio 2', 'Proceso: Indica de manera precisa los procesos que le dan solución al problema.', 2, 491),
(2308, 'C3', 'Criterio 3', 'Salida: Los datos presentados son acordes al problema planteado.', 2, 491),
(2309, 'C4', 'Criterio 4', 'Codificación: El ejercicio está escrito correctamente sin presentar errores de sintaxis, lógicos y en ejecución.', 2, 491),
(2310, 'C5', 'Criterio 5', 'Entrega: Presenta una solución en el tiempo indicado, limpio, ordenado.', 1, 491),
(2311, 'C6', 'Criterio 6', 'Errores: El ejercicio se entrega sin errores, ni correcciones previas.', 1, 491);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbldocentes`
--

CREATE TABLE `tbldocentes` (
  `vchFotoPerfil` varchar(255) DEFAULT NULL,
  `vchMatricula` varchar(10) NOT NULL,
  `vchAPaterno` varchar(255) DEFAULT NULL,
  `vchAMaterno` varchar(255) DEFAULT NULL,
  `vchNombre` varchar(255) DEFAULT NULL,
  `vchEmail` varchar(100) NOT NULL,
  `vchPassword` varchar(100) NOT NULL,
  `vchRecovery_token` varchar(255) DEFAULT NULL,
  `dtmRecovery_token_expire` datetime DEFAULT NULL,
  `enmEstadoUsuario` enum('activo','baja') NOT NULL DEFAULT 'activo',
  `enmEstadoCuenta` enum('activa','bloqueada') NOT NULL DEFAULT 'activa',
  `dtmfechaRegistro` timestamp NOT NULL DEFAULT current_timestamp(),
  `dtmUltimaConexion` timestamp NULL DEFAULT NULL,
  `dtmregistroUltimaContrasena` timestamp NULL DEFAULT NULL,
  `intRol` int(11) NOT NULL,
  `vchDepartamento` varchar(200) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `tbldocentes`
--

INSERT INTO `tbldocentes` (`vchFotoPerfil`, `vchMatricula`, `vchAPaterno`, `vchAMaterno`, `vchNombre`, `vchEmail`, `vchPassword`, `vchRecovery_token`, `dtmRecovery_token_expire`, `enmEstadoUsuario`, `enmEstadoCuenta`, `dtmfechaRegistro`, `dtmUltimaConexion`, `dtmregistroUltimaContrasena`, `intRol`, `vchDepartamento`) VALUES
('', '0006', 'ORTEGA', 'CRESPO', 'CESAR ADRIAN', 'cesar.ortega@uthh.edu.mx', '6b3b9a6ddb739ea6b3984e9038c33edeaecfb0eea476eba17b606d4699ca24e1', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0008', 'FELIPE', 'REDONDO', 'ANA MARIA', 'ana.felipe@uthh.edu.mx', '0b6dfcd5427a43a60b0a38360499be09d494c8d8d67d70fc23080186e17161ba', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0028', 'MARTINEZ', 'MAGOS', 'JUAN CARLOS', 'juan.martinez@uthh.edu.mx', 'fb363655ec3dc201f91e04702997a0528c4989bb109951f7fc4f842b5a6af7e7', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0034', 'HERNANDEZ', 'OSORIO', 'MARIA ANGELICA', 'maria.hernandez@uthh.edu.mx', 'a4c07683491e0eea92712a3a3d88bdfee0900e3e9a0ce9ea1faa1f2cf435157a', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0103', 'GONZALEZ', 'TORRES', 'JOSE DE JESUS', 'jose.gonzalez@uthh.edu.mx', '06843e3f58776ec2eb5e0cc7a44a3c3fc1b4b9af2e75504da3d299dc566cc395', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0117', 'JUAREZ', 'CASTILLO', 'EFREN', 'efren.juarez@uthh.edu.mx', '7c6886ff572fd550ea7fb64059a9f7082863f528c60f99a397dcd9b66fcab25f', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0128', 'GARCIA', 'MORALES', 'RICARDO', 'ricardo.garcia@uthh.edu.mx', 'eeb9ff3ea6582ce2bf03b9bbff95882290b8a8e528a391bc356917928f721c06', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0250', 'REYES', 'AQUINO', 'ISRAEL', 'israel.reyes@uthh.edu.mx', '59039885eb99ffae1e5544c097d8462fb5003793e0ff4b6449374e78770696c6', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0264', 'RODRIGUEZ', 'ARGUELLES', 'CARLOS ANDRES', 'carlos.rodriguez@uthh.edu.mx', 'ba9482e50cc91e295b0b966561f5ea61ead6cd1f0da98b5fd859ca8d3148853e', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0275', 'HERNANDEZ', 'HERNANDEZ', 'BEATRIZ', 'beatriz.hernandez@uthh.edu.mx', 'd3a780f832d288bd44a79551a67966f66ffc0145658e162dfe3c8cc010923f58', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0360', 'TALON', 'PORTES', 'JAVIER', 'javier.talon@uthh.edu.mx', 'f45372cd4ad8ddb3957fe2943605a547aa53b15e4eebf1455a0a1efb63b11529', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0400', 'AGUIRRE', 'MATIAS', 'ERIC AQUILEO', 'eric.aguirre@uthh.edu.mx', '3cd7fb32828b99f51cb94fe6a2606a19b77a4456caadaab50fbb51d873da509b', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0415', 'DEL CARMEN', 'MORALES', 'HEIDI ', 'heidi.morales@uthh.edu.mx', '735483905673bd9e3b9fe417248633156a3e9d5083ea65647272f9c9e37a994f', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0430', 'MARTINEZ', 'CASANOVA', 'RAFAEL', 'rafael.martinez@uthh.edu.mx', 'b6c76afc9374390004c2998480613a0fd5d17f12554d529589e8869e2988d047', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0431', 'MENDOZA', 'SAN JUAN', 'LUIS ALBERTO', 'luis.mendoza@uthh.edu.mx', '481885da4f3c8e27e9c4e6a9bc4619ee398c2784cca8a663524abe91b5cb7f47', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0432', 'RAMOS', 'HERNANDEZ', 'GADIEL', 'gadiel.ramos@uthh.edu.mx', '93759af6f455b1610e615483cf5ea847b0b7248055c16be328c9f292d8695a9c', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 1, '1'),
('', '0435', 'DEL CARMEN', 'MORALES', 'YUCELS ANAI', 'yucels.del carmen@uthh.edu.mx', 'b15a5582fa189c6d4b5f39f0cd7ff2623e72d6170419786e0e14ba595b32759e', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0440', 'RIVERA', 'MORENO', 'JUAN CARLOS', 'juan.rivera@uthh.edu.mx', '4ae84b3129a7b28b2855306d50a413373ac5b261a592b706c3d002f3e715700f', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0455', 'SALAZAR', 'CASANOVA', 'HERMES', 'hermes.salazar@uthh.edu.mx', 'eec0ae2663b74fdb9fb9981e92f1b2cc2a8b42444d358776d872580c79454c91', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0504', 'PAULIN', 'CASTILLO', 'GLADYS BEATRIZ', 'gladys.paulin@uthh.edu.mx', '9514bda5f1da3a11c1ec2b4d40252bcc327a89cc4cc0f01f673048a551333d08', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0534', 'HERVERT', 'VEGA', 'EUGENIO', 'eugenio.hervert@uthh.edu.mx', 'fff452b6e0f2e606bf993f1bd0fc3353b8602105a226cdf8f13a2970a0c6bf58', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0555', 'TORRES', 'RAMIREZ', 'MARYOL', 'maryol.torres@uthh.edu.mx', '506ded66eb8be8051c3bfcc0ba961fcd194d8299bbdf76edaff0c52cba80bcd8', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1'),
('', '0653', 'TOLAYO', 'MENDOZA', 'JUAN JOSE', 'juan.tolayo@uthh.edu.mx', '99f4f9d8b5b4fdfb1b6141fe6c4cfff15532006b13f4ef1bbde1c8dd7dc80a14', NULL, NULL, 'activo', 'activa', '2024-12-03 12:38:27', NULL, '2024-12-03 12:38:27', 2, '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblgrupo`
--

CREATE TABLE `tblgrupo` (
  `chrGrupo` char(1) NOT NULL
) ;

--
-- Volcado de datos para la tabla `tblgrupo`
--

INSERT INTO `tblgrupo` (`chrGrupo`) VALUES
('A'),
('B'),
('C'),
('D'),
('E'),
('F'),
('G'),
('H'),
('I'),
('J'),
('K');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblinstrumento`
--

CREATE TABLE `tblinstrumento` (
  `vchClvInstrumento` varchar(11) NOT NULL,
  `vchNombre` varchar(30) NOT NULL,
  `vchCarrera` int(11) NOT NULL,
  `intParcial` int(11) NOT NULL
) ;

--
-- Volcado de datos para la tabla `tblinstrumento`
--

INSERT INTO `tblinstrumento` (`vchClvInstrumento`, `vchNombre`, `vchCarrera`, `intParcial`) VALUES
('IE.LCBDA01', 'Instrumento', 64, 3),
('IE.LCBDA02', 'Instrumento', 64, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblmaterias`
--

CREATE TABLE `tblmaterias` (
  `vchClvMateria` varchar(10) NOT NULL,
  `vchNomMateria` varchar(255) DEFAULT NULL,
  `intHoras` int(11) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `tblmaterias`
--

INSERT INTO `tblmaterias` (`vchClvMateria`, `vchNomMateria`, `intHoras`) VALUES
('ABT001', 'METODOLOGÍA DE LA INVESTIGACIÓN', 75),
('ABT002', 'QUÍMICA ANALÍTICA', 105),
('ABT003', 'ADMINISTRACIÓN DE LABORATORIOS', 60),
('ABT004', 'QUÍMICA ORGÁNICA', 75),
('ABT005', 'AGRICULTURA SOSTENIBLE', 90),
('ABT006', 'EDAFOLOGÍA', 60),
('ABT007', 'DISEÑO DE APPS', 75),
('ABT008', 'AGROMETEOROLOGÍA', 60),
('ABT009', 'DISEÑOS EXPERIMENTALES', 90),
('ABT010', 'CONTROL DE PLAGAS Y MALEZAS', 60),
('ABT011', 'ECOLOGÍA MICROBIONA', 45),
('ABT012', 'FITOPATOLOGÍA', 60),
('ABT013', 'HERRAMIENTAS PLANEACIÓN Y COSTOS', 60),
('ABT014', 'PROPAGACIÓN VEGETATIVA', 75),
('ABT015', 'INTEGRADORA I', 30),
('ABT016', 'CONTROL BIOLÓGICO', 90),
('ABT017', 'INTEGRADORA II', 30),
('ABT018', 'BIORREMEDIACIÓN', 90),
('ABT019', 'ABONOS ORGÁNICOS', 60),
('ABT020', 'EXTRACCIÓN DE METABOLITOS', 60),
('ABT021', 'FISIOLOGÍA VEGETAL', 60),
('ABT022', 'BIOQUÍMICA', 60),
('ABT023', 'AGROBIOTECNOLOGÍA', 60),
('ABT024', 'AGROMETEREOLOGÍA', 45),
('ABT025', 'HERRAMIENTAS DE PLANEACIÓN DE COSTOS', 45),
('ABT026', 'AGRICULTURA SOSTENIBLE', 60),
('ABT027', 'PROPAGACIÓN VEGETATIVA', 60),
('ABT030', 'PROBABILIDAD Y ESTADÍSTICA POR HERRAMIENTAS', 75),
('ADM001', 'FUNDAMENTOS DE ADMINISTRACIÓN', 90),
('ADM002', 'CONTABILIDAD I', 105),
('ADM003', 'ESTADÍSTICA', 90),
('ADM004', 'INFORMÁTICA', 75),
('ADM005', 'PLANEACIÓN ESTRATÉGICA', 90),
('ADM006', 'PROCEDIMIENTOS ADMINISTRATIVOS', 90),
('ADM007', 'CONTABILIDAD II', 90),
('ADM008', 'ANÁLISIS E INTERPRETACIÓN DE ESTADOS FINANCIEROS', 75),
('ADM009', 'FUNDAMENTOS DE MERCADOTECNIA', 60),
('ADM010', 'DESARROLLO LOCAL Y REGIONAL I', 45),
('ADM011', 'TEORÍA Y DESARROLLO ORGANIZACIONAL', 75),
('ADM012', 'ADMINISTRACIÓN DEL CAPITAL DE TRABAJO', 75),
('ADM013', 'PLANEACIÓN FINANCIERA', 75),
('ADM014', 'ESTUDIO DE MERCADO', 75),
('ADM015', 'ECONOMÍA APLICADA A LOS NEGOCIOS', 60),
('ADM016', 'INTEGRADORA I', 30),
('ADM017', 'DESARROLLO LOCAL Y REGIONAL II', 60),
('ADM018', 'ESTUDIO TÉCNICO', 90),
('ADM019', 'ESTUDIO FINANCIERO', 90),
('ADM020', 'INFORMÁTICA APLICADA A LOS NEGOCIOS', 60),
('ADM021', 'SISTEMAS DE PRODUCCIÓN', 60),
('ADM022', 'EVALUACIÓN ECONÓMICA FINANCIERA', 105),
('ADM023', 'INTEGRADORA II', 30),
('ADP001', 'SOCIOLOGÍA Y ECONOMÍA RURAL', 90),
('ADP002', 'TEORÍA DE SISTEMAS', 90),
('ADP003', 'DESARROLLO REGIONAL', 105),
('ADP004', 'PROYECTOS I', 95),
('ADP005', 'ESTADÍSTICA DESCRIPTIVA', 90),
('ADP006', 'DESARROLLO DE EMPRENDEDORES', 105),
('ADP007', 'PROYECTOS II', 95),
('ADP008', 'ESTADÍSTICA INFERENCIAL', 90),
('ADP009', 'SISTEMAS DE PRODUCCIÓN Y CONSERVACIÓN AMBIENTAL', 105),
('ADP010', 'PROYECTOS III', 95),
('ADP011', 'FUNDAMENTOS DE NORMATIVIDAD LEGAL', 75),
('ADP012', 'INTEGRACIÓN SOCIOTÉCNICA', 75),
('ADP013', 'CONTABILIDAD Y FINANZAS', 105),
('ADP014', 'PROYECTOS IV', 95),
('ADP015', 'PRODUCCIÓN Y COMERCIALIZACIÓN', 90),
('ADP016', 'EXTENSIÓN PARA EL DESARROLLO DE PROYECTOS', 75),
('ADP017', 'MERCADOTECNIA', 105),
('ADP018', 'PROYECTOS V', 95),
('ADP019', 'MODELOS DE EVALUACIÓN', 90),
('ADP020', 'ORGANIZACIÓN DE APRENDIZAJE TECNOLÓGICO', 90),
('ADP100', 'MÉTODOS DE INVESTIGACIÓN DE MERCADOS', 90),
('ADP101', 'MICROECONOMÍA', 75),
('ADP102', 'DESARROLLO ECONÓMICO Y REGIONAL', 60),
('ADP103', 'MACROECONOMÍA', 75),
('ADP104', 'ESTUDIO DE MERCADO Y TÉCNICO', 105),
('ADP105', 'CONTABILIDAD', 75),
('ADP106', 'ESTUDIO FINANCIERO Y ECONÓMICO', 90),
('ADP107', 'MERCADOTECNIA', 90),
('ADP108', 'SISTEMAS PRODUCTIVOS Y CONSERVACIÓN AMBIENTAL', 75),
('ADP109', 'ADMINISTRACIÓN FINANCIERA', 60),
('ADP110', 'ADMINISTRACIÓN', 90),
('ADP111', 'INGENIERÍA ECONÓMICA', 60),
('ADP112', 'MODELOS DE EVALUACIÓN DE PROYECTOS DE INVERSIÓN', 75),
('ADP113', 'ESTUDIO DE CASOS DE PROYECTOS DE INVERSIÓN', 90),
('ADP114', 'COMERCIALIZACIÓN', 90),
('ADP115', 'DESARROLLO DE EMPRENDEDORES', 90),
('ADP116', 'ELABORACIÓN DE PROYECTOS DE INVERSIÓN', 60),
('ADP117', 'COMERCIO EXTERIOR', 90),
('ADP118', 'CONSULTORIA EMPRESARIAL', 75),
('ADP119', 'CAPACITACIÓN Y DESARROLLO DE PERSONAL', 75),
('ADP120', 'ADMINISTRACIÓN Y MERCADOTECNIA', 105),
('ADP121', 'DESARROLLO REGIONAL I', 45),
('ADP122', 'METODOLOGÍA DE LA INVESTIGACIÓN SOCIAL', 45),
('ADP123', 'DESARROLLO REGIONAL II', 45),
('ADP124', 'ESTUDIO DE MERCADO', 105),
('ADP125', 'MERCADOTECNIA', 75),
('ADP126', 'ESTUDIO TÉCNICO', 75),
('ADP127', 'SISTEMAS DE PRODUCCIÓN Y CONSERVACIÓN AMBIENTAL', 75),
('ADP128', 'ADMINISTRACIÓN DE PROYECTOS I', 75),
('ADP129', 'DESARROLLO DE EMPRENDEDORES', 75),
('ADP130', 'EVALUACIÓN ECONÓMICA Y SOCIAL', 90),
('ADP131', 'CASOS DE PROYECTOS DE INVERSIÓN', 75),
('ADP132', 'ADMINISTRACIÓN DE PROYECTOS II', 45),
('ADP133', 'CONSULTORIA EMPRESARIAL', 60),
('ADP134', 'ADMINISTRACIÓN', 75),
('ADP135', 'DESARROLLO LOCAL Y REGIONAL', 75),
('ADP136', 'ECONOMIA APLICADA A LOS NEGOCIOS', 90),
('ADP137', 'ESTUDIO DE MERCADO', 90),
('ADP138', 'CONTABILIDAD DE COSTOS', 75),
('ADP139', 'ANÁLISIS E INTERPRETACIÓN DE ESTADOS FINANCIEROS', 60),
('ADP140', 'CAPACITACIÓN Y DESARROLLO DE PERSONAL', 60),
('ADP141', 'ADMINISTRACIÓN DE PROYECTOS I', 60),
('ADP142', 'COMERCIALIZACIÓN', 75),
('ADP143', 'SISTEMAS Y PROCESOS ADMINISTRATIVOS', 60),
('ADP144', 'EVALUACIÓN ECONÓMICA Y FINANCIERA DE PROYECTOS', 90),
('ADP145', 'PLANEACIÓN ESTRATÉGICA Y PLAN DE NEGOCIOS', 90),
('ADP146', 'ADMINISTRACIÓN DE PROYECTOS II', 60),
('ADP147', 'COMERCIO EXTERIOR', 60),
('AGT001', 'BIOLOGÍA AGRÍCOLA', 75),
('AGT002', 'MICROBIOLOGÍA', 90),
('AGT003', 'QUÍMICA II', 60),
('AGT004', 'GENÉTICA VEGETAL', 60),
('AGT041', 'BIOLOGÍA AGRÍCOLA', 60),
('AGT100', 'FÍSICA', 200),
('AGT101', 'BIOLOGÍA', 75),
('AGT102', 'BOTÁNICA SISTEMÁTICA', 75),
('AGT103', 'QUÍMICA ORGÁNICA Y BIOQUÍMICA', 75),
('AGT104', 'MICROBIOLOGÍA AGRÍCOLA', 90),
('AGT105', 'MECANIZACIÓN AGRÍCOLA', 75),
('AGT106', 'DIBUJO Y TOPOGRAFÍA', 90),
('AGT107', 'FISIOLOGÍA VEGETAL', 75),
('AGT108', 'EDAFOLOGÍA', 90),
('AGT109', 'PROTECCIÓN VEGETAL', 90),
('AGT110', 'AGROECOLOGÍA', 60),
('AGT111', 'RIEGO Y DRENAJE', 60),
('AGT112', 'CULTIVOS BÁSICOS', 75),
('AGT113', 'ECONOMÍA AGROPECUARIA', 60),
('AGT114', 'SISTEMAS DE PRODUCCIÓN PECUARIA', 60),
('AGT115', 'PRODUCCIÓN Y CONSERVACIÓN DE FORRAJES', 60),
('AGT116', 'AGROFORESTERÍA', 60),
('AGT117', 'HORTICULTURA', 60),
('AGT118', 'FRUTICULTURA', 60),
('AGT119', 'ADMINISTRACIÓN DE EMPRESAS AGROPECUARIAS Y COMERCIALIZACIÓN', 75),
('AGT120', 'MANEJO HOLÍSTICO DE LOS RECURSOS I', 60),
('AGT121', 'BIOTECNOLOGÍA VEGETAL', 60),
('AGT122', 'MANEJO HOLÍSTICO DE  RECURSOS II', 60),
('AGT123', 'BIOFERTILIZANTES', 45),
('AGT124', 'BIOCONTROLES', 45),
('AGT125', 'ADMINISTRACIÓN DE EMPRESAS AGROPECUARIAS Y COMERCIALIZACIÓN', 60),
('AGT126', 'DIBUJO Y TOPOGRAFIA', 45),
('AGT127', 'BOTÁNICA SISTEMÁTICA', 90),
('AGT128', 'FISIOLOGÍA VEGETAL', 45),
('AGT129', 'EDAFOLOGÍA', 75),
('AGT130', 'BIOQUÍMICA', 75),
('AGT131', 'GENÉTICA GENERAL', 75),
('AGT132', 'AGROECOLOGÍA Y PROTECCIÓN AMBIENTAL', 60),
('AGT133', 'MANEJO HOLÍSTICO DE RECURSOS I', 60),
('AGT134', 'CULTIVOS BÁSICOS', 45),
('AGT135', 'BIOTECNOLOGÍA VEGETAL', 90),
('AGT136', 'BIOFERTILIZANTES', 60),
('AGT137', 'BIOCONTROLES', 60),
('AGT138', 'HORTICULTURA', 45),
('AGT139', 'FRUTICULTURA', 45),
('AGT140', 'BOTÁNICA SISTEMÁTICA', 60),
('APT001', 'ADMINISTRACION DE PROYECTOS DE TI', 45),
('C139', 'CACA', NULL),
('CBA001', 'ÁLGEBRA', 60),
('CBA002', 'INFORMÁTICA BÁSICA', 75),
('CBA003', 'QUÍMICA I', 60),
('CBA004', 'MÉTODOS ESTADÍSTICOS', 90),
('CBA005', 'PRINCIPIOS BÁSICOS DE QUÍMICA', 105),
('CBA006', 'INTRODUCCIÓN A LA FISICOQUÍMICA', 105),
('CBA007', 'QUÍMICA', 75),
('CBA008', 'INFORMÁTICA I', 60),
('CBA009', 'ESTADÍSTICA', 75),
('CBA010', 'ESTÁTICA', 75),
('CBA011', 'FÍSICA', 60),
('CBA012', 'MATEMÁTICAS III', 90),
('CBA013', 'MATEMÁTICAS FINANCIERAS', 75),
('CBA014', 'QUÍMICA I', 90),
('CBA015', 'FUNDAMENTOS DE ESTÁTICA Y DINÁMICA', 60),
('CBA016', 'MATEMÁTICAS', 90),
('CBA017', 'BIOLOGÍA', 45),
('CBA018', 'ÁLGEBRA LINEAL', 90),
('CBA019', 'QUÍMICA BÁSICA', 75),
('CBA020', 'MATEMÁTICAS PARA INGENIERÍA II', 75),
('CBA021', 'FUNCIONES MATEMÁTICAS', 60),
('CBA022', 'CÁLCULO DIFERENCIAL', 60),
('CBA023', 'TERMODINÁMICA', 45),
('CBA024', 'QUÍMICA ANALÍTICA', 90),
('CBA025', 'CÁLCULO INTEGRAL', 60),
('CIS369', 'CIENCIAS SOCIALES', 36),
('CIV001', 'MATEMÁTICAS PARA INGENIERÍA I', 60),
('CIV002', 'DINÁMICA', 60),
('CIV003', 'LEGISLACIÓN DE LA OBRAS', 45),
('CIV004', 'CONSTRUCCIÓN DE CAMINOS', 45),
('CIV005', 'ALCANTARILLADO Y AGUA POTABLE', 60),
('CIV006', 'ANÁLISIS ESTRUCTURAL', 75),
('CIV007', 'LABORATORIO DE SUELOS', 60),
('CIV008', 'INSTALACIONES ESPECIALES I', 60),
('CIV009', 'DISEÑO ESTRUCTURAL EN CONCRETO REFORZADO', 90),
('CIV010', 'EDIFICACIÓN SUSTENTABLE', 60),
('CIV011', 'INSTALACIONES ESPECIALES II', 45),
('CIV012', 'OBRAS HIDRAÚLICAS', 45),
('CIV013', 'FUNDAMENTOS DE DISEÑO ESTRUCTURAL EN ACERO', 45),
('CIV015', 'DISEÑO VIRTUAL DE EDIFICACIONES', 75),
('CIV016', 'EDIFICACIONES INTELIGENTES', 45),
('CIV017', 'INGENIERÍA DE COSTOS', 60),
('CIV018', 'PLANEACIÓN Y PROGRAMACIÓN DE OBRA', 75),
('CIV019', 'INTEGRADORA', 30),
('CON001', 'DERECHO CIVIL', 45),
('CON002', 'CONTABILIDAD BÁSICA', 120),
('CON003', 'FUNDAMENTOS DE ADMINISTRACIÓN', 60),
('CON004', 'INFORMÁTICA II', 60),
('CON005', 'DERECHO MERCANTIL', 45),
('CON006', 'CONTABILIDAD INTERMEDIA', 105),
('CON007', 'DERECHO LABORAL', 60),
('CON008', 'ECONOMÍA', 60),
('CON009', 'CALIDAD', 45),
('CON010', 'INTRODUCCIÓN AL DERECHO FISCAL', 60),
('CON011', 'CONTABILIDAD SUPERIOR', 90),
('CON012', 'INTEGRADORA I', 30),
('CON013', 'FUNDAMENTOS DE AUDITORIA', 45),
('CON014', 'CONTABILIDAD DE COSTOS I', 60),
('CON015', 'CONTRIBUCIONES DE PERSONAS FÍSICAS', 105),
('CON016', 'COMERCIO EXTERIOR', 45),
('CON017', 'AUDITORÍA FINANCIERA', 105),
('CON018', 'CONTABILIDAD DE COSTOS II', 60),
('CON019', 'CONTRIBUCIONES DE PERSONAS MORALES', 75),
('CON020', 'SUELDOS Y SALARIOS', 90),
('CON021', 'EVALUACIÓN FINANCIERA DE PROYECTOS', 60),
('CON022', 'INTEGRADORA II', 30),
('CON100', 'IMPUESTOS I', 105),
('CON101', 'CONTABILIDAD', 90),
('CON102', 'CONTABILIDAD INTERMEDIA', 75),
('CON103', 'IMPUESTOS II', 75),
('CON104', 'CONTABILIDAD DE SOCIEDADES', 60),
('CON105', 'APLICAR LEYES FISCALES Y MERCANTILES (IMPUESTOS III)', 90),
('CON106', 'TECNOLOGÍAS DE FABRICACIÓN', 60),
('CON107', 'DERECHO MERCANTIL', 60),
('CON108', 'CONTABILIDAD EMPRESARIAL', 75),
('CON109', 'FINANZAS', 75),
('CON110', 'COSTOS I', 75),
('CON111', 'SISTEMAS CONTABLES', 75),
('CON112', 'AUDITORIA CONTABLE Y FISCAL (AUDITORIA I)', 75),
('CON113', 'ADMINISTRACIÓN FINANCIERA', 75),
('CON114', 'REGISTRO CONTABLE DE COSTOS (COSTOS II)', 75),
('CON115', 'DERECHO LABORAL', 90),
('CON116', 'ECONOMÍA', 60),
('CON117', 'PRESUPUESTOS', 45),
('CON118', 'AUDITORIA ADMINISTRATIVA Y FINANCIERA (AUDITORIA II)', 90),
('CON119', 'ANTEPROYECTO DE ESTADÍA', 30),
('CON120', 'CONTABILIDAD INTERMEDIA', 90),
('CON121', 'DERECHO LABORAL', 75),
('CON122', 'CONTABILIDAD EMPRESARIAL', 90),
('CON123', 'FINANZAS I', 75),
('CON124', 'AUDITORIA I', 75),
('CON125', 'COSTOS II', 60),
('CON126', 'SISTEMAS CONTABLES', 60),
('CON127', 'AUDITORIA II', 90),
('CON128', 'COMERCIO INTERNACIONAL', 45),
('CON129', 'PROYECTOS DE INVERSIÓN', 60),
('CON130', 'FINANZAS II', 75),
('CON131', 'IMPUESTOS III', 90),
('CON132', 'DERECHO CIVIL Y MERCANTIL', 60),
('CON133', 'ECONOMÍA', 90),
('CON134', 'COSTOS II', 45),
('CON135', 'AUDITORIA I', 60),
('CON136', 'SISTEMAS DE ADMINISTRACIÓN CONTABLE', 60),
('CON137', 'PROYECTOS DE INVERSIÓN', 90),
('CON138', 'IMPUESTOS III', 75),
('CON139', 'FINANZAS II', 60),
('COT001', 'DIBUJO ARQUITECTÓNICO Y ESTRUCTURAL', 90),
('COT002', 'INTRODUCCIÓN A LA CONSTRUCCIÓN', 60),
('COT003', 'QUÍMICA EN LA CONSTRUCCIÓN', 45),
('COT004', 'ESTÁTICA', 90),
('COT005', 'DIBUJO EN INSTALACIONES', 90),
('COT006', 'MATERIALES Y PROCESOS CONSTRUCTIVOS I', 90),
('COT007', 'TOPOGRAFÍA', 75),
('COT008', 'MATERIALES Y PROCESOS CONSTRUCTIVOS II', 60),
('COT009', 'RESISTENCIA DE MATERIALES', 75),
('COT010', 'PRESUPUESTOS DE OBRA', 105),
('COT011', 'LICITACIÓN DE OBRA PÚBLICA', 75),
('COT012', 'INTEGRADORA I', 30),
('COT013', 'MATEMÁTICAS III', 75),
('COT015', 'PROBABILIDAD Y ESTADÍSTICA', 75),
('COT016', 'TECNOLOGÍA DEL CONCRETO', 75),
('COT017', 'INSTALACIONES EN LOS EDIFICIOS', 75),
('COT018', 'MATERIALES Y PROCESOS CONSTRUCTIVOS ESPECIALES', 75),
('COT019', 'MAQUINARIA PESADA Y MOV. DE TIERRAS', 75),
('COT020', 'MECÁNICA DE SUELOS', 60),
('COT021', 'TECNOLOGÍA DEL CONCRETO', 105),
('COT022', 'CIMENTACIONES', 105),
('COT023', 'SEGURIDAD EN LA CONSTRUCCIÓN', 75),
('COT024', 'ADMINISTRACIÓN DE LA CONSTRUCCIÓN', 75),
('COT025', 'INTEGRADORA II', 30),
('COT026', 'INFORMÁTICA', 45),
('COT027', 'DIBUJO DE INSTALACIONES', 90),
('COT028', 'MATERIALES Y PROCESOS CONSTRUCTIVOS I', 75),
('COT029', 'PRESUPUESTOS DE OBRA', 90),
('COT030', 'LICITACIÓN DE OBRA PÚBLICA', 60),
('COT031', 'INSTALACIONES EN LOS EDIFICIOS', 60),
('COT032', 'MAQUINARIA PESADA Y MOVIMIENTOS DE TIERRAS', 60),
('COT033', 'HIDRÁULICA', 60),
('DNG001', 'MATEMÁTICAS', 60),
('DNG002', 'ENTORNO DE LA EMPRESA', 60),
('DNG003', 'ADMINISTRACIÓN', 60),
('DNG004', 'INFORMÁTICA PARA NEGOCIOS I', 60),
('DNG005', 'ESTADÍSTICA PARA NEGOCIOS', 75),
('DNG006', 'INFORMÁTICA PARA NEGOCIOS II', 75),
('DNG007', 'ESTUDIO DEL CONSUMIDOR', 60),
('DNG008', 'COMPRAS', 75),
('DNG009', 'PRESUPUESTOS', 60),
('DNG010', 'GESTIÓN DE VENTAS', 75),
('DNG011', 'FINANZAS', 60),
('DNG012', 'ESTRATEGIAS DE VENTA', 75),
('DNG013', 'ADMINISTRACIÓN DE ALMACÉN', 75),
('DNG014', 'INTEGRADORA I', 30),
('DNG015', 'INVESTIGACIÓN DE MERCADOS I', 75),
('DNG016', 'MERCADOTECNIA ESTRATÉGICA', 60),
('DNG017', 'COMUNICACIÓN INTEGRAL DE MERCADOTECNIA', 60),
('DNG018', 'PLAN DE NEGOCIOS', 90),
('DNG019', 'INVESTIGACIÓN DE MERCADOS II', 75),
('DNG020', 'MEZCLA DE MERCADOTECNIA', 90),
('DNG021', 'PRODUCCIÓN PUBLICITARIA I', 75),
('DNG022', 'COMERCIO INTERNACIONAL', 90),
('DNG023', 'PLANEACIÓN ESTRATÉGICA DE MERCADOTECNIA', 90),
('DNG024', 'PLAN DE EXPORTACIÓN', 60),
('DNG025', 'COMERCIO ELECTRÓNICO', 60),
('DNG026', 'PRODUCCIÓN PUBLICITARIA II', 90),
('DNG027', 'RELACIONES HUMANAS', 60),
('DNG028', 'INTEGRADORA II', 30),
('EST001', 'ESTADÍA', 540),
('EST002', 'ESTADÍA', 510),
('EST200', 'ESTADÍA EN EL SECTOR PRODUCTIVO', 500),
('EST201', 'ESTADÍA', 525),
('EST202', 'ESTADÍA EN EL SECTOR PRODUCTIVO', 510),
('EST203', 'ESTADÍA EN EL SECTOR PRODUCTIVO', 480),
('FOD001', 'ADMINISTRACIÓN DEL TIEMPO', 45),
('FOD002', 'PLANEACIÓN Y ORGANIZACIÓN DEL TRABAJO', 45),
('FOD003', 'DIRECCIÓN DE EQUIPOS DE ALTO RENDIMIENTO', 30),
('FOD004', 'NEGOCIACIÓN EMPRESARIAL', 30),
('GAT001', 'MATEMÁTICAS APLICADAS A LA GASTRONOMÍA', 60),
('GAT002', 'SEGURIDAD E HIGIENE EN ALIMENTOS', 45),
('GAT003', 'INTRODUCCIÓN A LA GASTRONOMÍA', 75),
('GAT004', 'BASES CULINARIAS', 120),
('GAT005', 'INFORMÁTICA', 60),
('GAT006', 'ESTADÍSTICA', 60),
('GAT007', 'FUNDAMENTOS DE NUTRICIÓN', 60),
('GAT008', 'OPERACIÓN DE BAR', 60),
('GAT009', 'MÉTODOS Y TÉCNICAS CULINARIAS', 120),
('GAT010', 'MANEJO DE ALMACÉN', 45),
('GAT011', 'PANADERÍA', 90),
('GAT012', 'COSTOS Y PRESUPUESTOS', 75),
('GAT013', 'FUNDAMENTOS DE VITIVINICULTURA', 60),
('GAT014', 'ESTANDARIZACIÓN DE PLATILLLOS', 120),
('GAT015', 'ADMINISTRACIÓN DE ALIMENTOS Y BEBIDAS I', 60),
('GAT016', 'PASTELERÍA', 105),
('GAT017', 'SERVICIOS DE ALIMENTOS Y BEBIDAS', 90),
('GAT018', 'MERCADOTECNIA DE SERVICIOS GASTRONÓMICOS', 60),
('GAT019', 'ADMINISTRACIÓN DE ALIMENTOS Y BEBIDAS II', 60),
('GAT020', 'REPOSTERÍA', 90),
('GAT021', 'INTEGRADORA I', 30),
('GAT022', 'EVALUACIÓN DE SERVICIOS GASTRONÓMICOS', 75),
('GAT023', 'CONFORMACIÓN DE MENÚS', 120),
('GAT024', 'LOGÍSTICA DE EVENTOS', 105),
('GAT025', 'INTEGRADORA II', 30),
('HIS001', 'Historia', 60),
('IAB001', 'MATEMÁTICAS PARA INGENIERÍA I', 60),
('IAB002', 'FISICOQUÍMICA', 45),
('IAB003', 'ADMINISTRACIÓN DE LA PRODUCCIÓN AGROBIOTECNOLÓGICA', 75),
('IAB004', 'BIOESTADÍSTICA', 45),
('IAB005', 'ADMINISTRACIÓN DE LA CALIDAD', 90),
('IAB006', 'OPERACIONES UNITARIAS II', 45),
('IAB007', 'BIOLOGÍA MOLECULAR', 105),
('IAB008', 'COSERVACIÓN DE BIOPRODUCTOS', 60),
('IAB009', 'BIOINGENIERÍA', 60),
('IAB010', 'INGENIERÍA GENÉTICA', 90),
('IAB011', 'INGENIERÍA ECONÓMICA', 75),
('IAB012', 'CARACTERIZACIÓN DE BIOPRODUCTOS', 90),
('IAB013', 'INTEGRADORA', 30),
('IBI001', 'CÁLCULO DIFERENCIAL  INTEGRAL', 75),
('IBI002', 'TERMODINÁMICA', 45),
('IBI003', 'OPERACIONES UNITARIAS I', 75),
('IBI004', 'ANÁLISIS INSTRUMENTAL', 30),
('IBI005', 'SEGURIDAD E HIGIENE', 30),
('IBI006', 'ADMINISTRACIÓN Y CONTABILIDAD', 30),
('IBI007', 'ECUACIONES DIFERENCIALES', 60),
('IBI008', 'FENÓMENOS DE TRANSPORTE', 60),
('IBI009', 'INGENIERÍA DE LAS FERMENTACIONES', 60),
('IBI010', 'OPERACIONES UNITARIAS II', 60),
('IBI011', 'DESARROLLO SUSTENTABLE', 30),
('IBI012', 'INFORMÁTICA PARA INGENIEROS', 60),
('IBI013', 'INGENIERÍA DE PROYECTOS', 60),
('IBI014', 'DISEÑOS EXPERIMENTALES', 75),
('IBI015', 'AGRICULTURA PROTEGIDA', 60),
('IBI016', 'LEGISLACIÓN', 30),
('IBI017', 'BIOLOGÍA MOLECULAR', 60),
('IBI018', 'ANÁLISIS FISICOQUÍMICOS Y MICROBIOLÓGICOS', 45),
('IBI019', 'INTEGRADORA II', 30),
('IBI020', 'BIOINGENIERÍA APLICADA', 60),
('IBI021', 'AGRICULTURA ORGÁNICA', 45),
('ICI001', 'CÁLCULO MULTIVARIABLE', 60),
('ICI002', 'DINÁMICA', 60),
('ICI003', 'ANÁLISIS ESTRUCTURAL', 75),
('ICI004', 'IMPACTO AMBIENTAL', 30),
('ICI005', 'EVALUACIÓN DE PROYECTOS', 30),
('ICI006', 'LEGISLACIÓN EN LA CONSTRUCCIÓN', 30),
('IDI001', 'ESTADÍSTICA PARA NEGOCIOS', 60),
('IDI002', 'ECONOMÍA PARA LOS NEGOCIOS', 75),
('IDI003', 'GESTIÓN DE COMPRAS', 60),
('IDI004', 'DERECHO CORPORATIVO', 75),
('IDI005', 'ESTRATEGIAS PARA NUEVOS NEGOCIOS', 45),
('IDI006', 'DIRECCIÓN DE CAPITAL HUMANO I', 90),
('IDI007', 'CRM MERCADOTECNIA DE RELACIONES', 60),
('IDI008', 'ADMINISTRACIÓN FINANCIERA', 75),
('IDI009', 'TÉCNICAS PARA LA INNOVACIÓN', 75),
('IDI010', 'SISTEMAS DE CONTROL ADMINISTRATIVO', 75),
('IDI011', 'ESTRATEGIAS CORPORATIVAS DE VENTAS', 60),
('IDI012', 'INTEGRADORA I', 30),
('IDI013', 'CREATIVIDAD EMPRESARIAL', 45),
('IDI014', 'INGENIERÍA FINANCIERA', 90),
('IDI015', 'DESARROLLO EMPRESARIAL', 60),
('IDI016', 'DIRECCIÓN DE CAPITAL HUMANO II', 45),
('IDI017', 'REINGENIERÍA ORGANIZACIONAL', 60),
('IDI018', 'INTEGRADORA II', 30),
('IES001', 'ESTADÍA', 480),
('IFF001', 'ESTRUCTURA FINANCIERA', 105),
('IFF002', 'CONTABILIDADES ESPECIALES', 60),
('IFF003', 'SIMULADOR FISCAL DE PERSONAS FÍSICAS', 105),
('IFF004', 'ESTRUCTURA DE CAPITAL', 75),
('IFF005', 'SIMULADOR FISCAL DE PERSONAS MORALES', 105),
('IFF006', 'CONTABILIDAD GUBERNAMENTAL', 90),
('IFF007', 'ADMINISTRACIÓN DE COSTOS E INVENTARIOS', 60),
('IFF008', 'SIMULADOR FISCAL DE PERSONAS MORALES SIN FINES DE LUCRO', 45),
('IFF009', 'AUDITORIA GUBERNAMENTAL', 60),
('IFF010', 'EVALUACIÓN FINANCIERA', 45),
('IFF011', 'AUDITORIA FISCAL', 60),
('IFF012', 'SEMINARIO DE DEFENSA FISCAL', 45),
('IFF013', 'ADMINISTRACIÓN DE COSTOS PARA LA TOMA DE DECISIONES', 60),
('IFF014', 'INTEGRADORA II', 30),
('IFF015', 'INTEGRADORA III', 30),
('IFF016', 'OPTATIVA II', 60),
('IFF017', 'SEMINARIO DE INVESTIGACIÓN', 60),
('IFF018', 'ADMINISTRACIÓN DE RECURSOS HUMANOS', 45),
('IGA001', 'PATRIMONIO CULINARIO DE MÉXICO', 75),
('IGA002', 'COCINA ORIENTAL', 105),
('IGA003', 'INGENIERÍA DE PROCESOS GASTRONÓMICOS', 75),
('IGA004', 'MIXIOLOGÍA', 45),
('IGA005', 'COCINA EUROPEA', 120),
('IGA006', 'CONTABILIDAD ADMINISTRATIVA', 75),
('IGA007', 'GESTIÓN DE COMPRAS', 45),
('IGA008', 'INGENIERÍA DE MENU', 60),
('IGA009', 'COCINA MEXICANA', 120),
('IGA010', 'ANÁLISIS E INTERPRETACIÓN FINANCIERA', 75),
('IGA011', 'GESTIÓN DE LA CALIDAD EN ESTABLECIMIENTOS DE ALIMENTOS Y BEBIDAS', 45),
('IGA012', 'DESARROLLO DE CONCEPTOS GASTRONOMICOS', 75),
('IGA013', 'ALTA COCINA MEXICANA', 90),
('IGA014', 'GESTIÓN EMPRESARIAL', 75),
('IGA015', 'INTEGRADORA', 30),
('IGP001', 'SEMINARIO DE LA INVESTIGACIÓN', 75),
('IGP002', 'MATEMÁTICAS APLICADAS', 75),
('IGP003', 'DIAGNÓSTICO EMPRESARIAL', 75),
('IGP004', 'INFORMÁTICA GERENCIAL', 45),
('IGP005', 'MARCO LEGAL DE LAS ORGANIZACIONES', 90),
('IGP006', 'DISEÑO Y APLICACIÓN DE LA CONSULTORÍA', 90),
('IGP007', 'SISTEMA FINANCIERO NACIONAL', 90),
('IGP008', 'ADMINISTRACIÓN DE ORGANIZACIONES', 90),
('IGP009', 'DIRECCIÓN DE MERCADOTECNIA', 75),
('IGP010', 'GESTIÓN DEL FINANCIAMIENTO', 90),
('IGP011', 'DIRECCIÓN ESTRATÉGICA', 90),
('IGP012', 'APLICACIÓN DEL FINANCIAMIENTO', 90),
('IGP013', 'INTEGRADORA II', 30),
('IGP014', 'AUDITORIA ADMINISTRATIVA', 75),
('IMM001', 'ANÁLISIS VECTORIAL', 60),
('IMM002', 'SEGURIDAD INDUSTRIAL', 45),
('IMM003', 'CIENCIAS DE LOS MATERIALES', 60),
('IMM004', 'METODOLOGÍA DE LA INVESTIGACIÓN PARA EL DISEÑO', 45),
('IMM005', 'INGENIERÍA ECONÓMICA', 60),
('IMM006', 'ECUACIONES DIFERENCIALES APLICADAS', 75),
('IMM007', 'ADMINISTRACIÓN INDUSTRIAL', 60),
('IMM008', 'DINÁMICA Y MECANISMOS', 60),
('IMM009', 'PROCESOS DE CONFORMADO', 75),
('IMM010', 'MECÁNICA DE SÓLIDOS', 60),
('IMM011', 'DISEÑO ASISTIDO POR COMPUTADORA', 75),
('IMM012', 'TRANSFERENCIA DE CALOR', 60),
('IMM013', 'MANUFACTURA ASISTIDA POR COMPUTADORA', 60),
('IMM014', 'DISEÑO MECÁNICO', 90),
('IMM015', 'INSTRUMENTACIÓN Y CONTROL', 45),
('IMM016', 'INTEGRADORA II', 30),
('IMM017', 'DISEÑO DE HERRAMENTALES', 60),
('IMM018', 'DISEÑO ASISTIDO POR COMPUTADORA II', 60),
('IMT001', 'CÁLCULO APLICADO', 60),
('IMT002', 'ELECTRICIDAD INDUSTRIAL', 75),
('IMT003', 'DISEÑO ASISTIDO POR COMPUTADORA', 60),
('IMT004', 'INSTRUMENTACIÓN VIRTUAL', 75),
('IMT005', 'CONTROL DE MOTORES', 75),
('IMT006', 'MECÁNICA PARA LA AUTOMATIZACIÓN', 60),
('IMT007', 'PROGRAMACIÓN AVANZADA', 60),
('IMT008', 'CONTROL ESTADÍSTICO DE PROCESOS', 45),
('IMT009', 'CONTROL AUTOMÁTICO', 90),
('IMT010', 'ADMINISTRACIÓN DE PROYECTOS', 45),
('IMT011', 'SISTEMAS MECÁNICOS', 60),
('IMT012', 'INGENIERÍA DE MATERIALES', 45),
('IMT013', 'CONTROL LÓGICO  AVANZADO', 75),
('IMT014', 'SISTEMAS DE MANUFACTURA FLEXIBLE', 90),
('IMT015', 'DISPOSITIVOS DIGITALES PROGRAMABLES', 90),
('IMT016', 'INTEGRADORA', 30),
('INF001', 'INTRODUCCIÓN A LA COMPUTACIÓN', 60),
('INF002', 'TALLER DE COMPUTACIÓN I', 105),
('INF003', 'GESTIÓN DE LA TECNOLOGÍA', 60),
('INF004', 'TALLER DE COMPUTACIÓN II', 90),
('INF005', 'ANÁLISIS DE SISTEMAS DE INFORMACIÓN', 75),
('INF006', 'ESTRUCTURA DE DATOS', 75),
('INF007', 'BASE DE DATOS I', 75),
('INF008', 'INFORMÁTICA EN EL SECTOR PRODUCTIVO', 60),
('INF009', 'PROGRAMACIÓN AVANZADA', 75),
('INF010', 'REDES LOCALES', 90),
('INF011', 'AUDITORIA Y SEGURIDAD INFORMÁTICA', 75),
('INF012', 'PLATAFORMAS TECNOLÓGICAS', 90),
('INF013', 'TELEINFORMÁTICA', 105),
('INF014', 'ADMINISTRACIÓN DE RECURSOS INFORMÁTICOS', 75),
('INF015', 'PROYECTOS DE INFORMÁTICA', 90),
('INF017', 'INTRODUCCIÓN A LA INFORMÁTICA', 75),
('INF018', 'CÓMPUTO', 120),
('INF019', 'DIBUJO ASISTIDO POR COMPUTADORA', 76),
('INF100', 'INFORMÁTICA I', 105),
('INF101', 'LÓGICA DE PROGRAMACIÓN', 90),
('INF102', 'INFORMÁTICA II', 105),
('INF103', 'PROGRAMACIÓN', 90),
('INF104', 'SISTEMAS MULTIUSUARIOS', 90),
('INF105', 'INFORMÁTICA PARA INGENIEROS', 105),
('INF106', 'INFORMÁTICA PARA ADMINISTRACIÓN', 105),
('INF107', 'ANÁLISIS DE SISTEMAS DE INFORMACIÓN', 90),
('INF108', 'ESTRUCTURA DE DATOS', 90),
('INF109', 'BASE DE DATOS I', 90),
('INF110', 'BASE DE DATOS II', 90),
('INF111', 'DISEÑO DE SISTEMAS DE INFORMACIÓN', 75),
('INF112', 'PROGRAMACIÓN AVANZADA', 90),
('INF113', 'REDES I', 90),
('INF114', 'REDES II', 90),
('INF115', 'AUDITORIA DE LA FUNCIÓN INFORMÁTICA', 75),
('INF116', 'PROYECTOS INFORMÁTICOS', 105),
('INF117', 'TECNOLOGÍAS AVANZADAS DE INFORMACIÓN', 75),
('INF118', 'ADMINISTRACIÓN DE LA FUNCIÓN INFORMÁTICA', 60),
('INF119', 'INFORMÁTICA I', 75),
('INF120', 'REDES DE ÁREA LOCAL', 90),
('INF121', 'INFORMÁTICA II', 75),
('INF122', 'INFORMÁTICA PARA INGENIEROS', 60),
('INF123', 'PROGRAMACIÓN VISUAL', 90),
('INF124', 'REDES DE ÁREA AMPLIA', 90),
('INF125', 'ANÁLISIS Y  DISEÑO DE SISTEMAS DE INFORMACIÓN I', 90),
('INF126', 'INFORMÁTICA PARA ADMINISTRACIÓN', 60),
('INF127', 'SISTEMAS OPERATIVOS MULTIUSUARIOS', 90),
('INF128', 'ANÁLISIS Y DISEÑO DE SISTEMAS DE INFORMACIÓN II', 75),
('INF129', 'PROGRAMACIÓN ORIENTADA AL WEB', 75),
('INF130', 'PROYECTOS INFORMÁTICOS', 90),
('INF131', 'LÓGICA DE PROGRAMACIÓN', 75),
('INF132', 'MANTENIMIENTO PREVENTIVO', 60),
('INF133', 'PROGRAMACIÓN DE COMPUTADORAS', 90),
('INF134', 'COMUNICACIÓN DE DATOS', 75),
('INF135', 'INFORMÁTICA III', 60),
('INF136', 'REDES DE COMPUTO', 90),
('INF137', 'BASE DE DATOS', 75),
('INF138', 'BASE DE DATOS II', 105),
('INF139', 'PROGRAMACIÓN VISUAL', 105),
('INF140', 'CALIDAD EN EL DESARROLLO DE SOFTWARE', 60),
('INF141', 'DESARROLLO DE SITIOS WEB', 75),
('INF142', 'PROYECTO DE CARRERA', 75),
('INF143', 'PROGRAMACIÓN AVANZADA', 105),
('INF144', 'ADMINISTRACIÓN Y AUDITORIA DE LA FUNCIÓN INFORMÁTICA', 60),
('INF145', 'MULTIMEDIA I', 90),
('INF146', 'SISTEMAS DE NEGOCIOS ELECTRÓNICOS I', 75),
('INF147', 'AMBIENTE ECONÓMICO EMPRESARIAL', 45),
('INF148', 'DISEÑO GRÁFICO', 75),
('INF149', 'CAPACITACIÓN A USUARIOS', 60),
('INF150', 'INGENIERÍA DE SOFTWARE', 90),
('INF151', 'MULTIMEDIA II', 90),
('INF152', 'SISTEMAS DE NEGOCIOS ELECTRÓNICOS II', 105),
('INF153', 'INVESTIGACIÓN DE OPERACIONES', 90),
('INT001', 'PRÁCTICA INTEGRAL', 60),
('INT002', 'MÁQUINAS DE COMBUSTIÓN INTERNA', 45),
('INT003', 'TALLER DE REDACCIÓN', 40),
('INT004', 'TALLER DE PROGRAMACIÓN', 45),
('INT005', 'TECNOLOGÍA Y EQUIPO DE DIAGNÓSTICO AUTOMOTRIZ', 60),
('INT006', 'DESARROLLO DE BASE DE DATOS', 75),
('INT007', 'CULTIVOS BÁSICOS', 45),
('INT008', 'HÁBITOS DE ESTUDIO', 60),
('INT010', 'QUIMICA ANALITICA', 4),
('INT011', 'ADMINISTRACION DE LABORATORIOS', 4),
('INT012', 'QUIMICA ORGANICA', 4),
('INT013', 'INTEGRADORA I', 4),
('INT014', 'METODOLOGIA DE LA INVESTIGACION', 4),
('INT015', 'REDES DE COMUNICACIÓN EN SISTEMAS OBD2', 45),
('INT016', 'BASE DE DATOS RELACIONALES', 75),
('INT017', 'LÓGICA DE PROGRAMACIÓN II', 45),
('INT018', 'COMBUSTIBLES ALTERNATIVOS', 60),
('INT019', 'METODOLOGÍA DE LA INVESTIGACIÓN', 75),
('INT020', 'BASE DE DATOS RELACIONALES', 60),
('INT021', 'MANEJO HOLÍSTICO DE RECURSOS', 60),
('INT022', 'DIBUJO Y TOPOGRAFÍA', 90),
('INT100', 'SISTEMAS Y PROCEDIMIENTOS ADMINISTRATIVOS', 60),
('INT101', 'PROYECTOS ESPECÍFICOS', 0),
('INT102', 'DESARROLLO INTEGRAL', 40),
('INT103', 'TALLER DE INFORMÁTICA', 0),
('INT104', 'TALLER DE CONTABILIDAD I', 60),
('INT105', 'PROYECTOS DE INVERSION', 60),
('INT106', 'COSTOS', 60),
('INT107', 'DESARROLLO DE HABILIDADES DEL PENSAMIENTO II', 40),
('INT108', 'TECNOLOGÍA DE TALLER', 60),
('INT109', 'DESARROLLO DE HABILIDADES DEL PENSAMIENTO I', 40),
('INT110', 'DESARROLLO DE HABILIDADES DEL PENSAMIENTO III', 30),
('INT111', 'SISTEMAS BÁSICOS DEL AUTOMOVIL', 60),
('INT112', 'TALLER DE CONTABILIDAD', 75),
('INT113', 'TECNOLOGIA ELECTRICA DEL AUTOMOVIL', 45),
('INT114', 'AUTOMATIZACIÓN INDUSTRIAL', 60),
('INT115', 'INGENIERÍA INDUSTRIAL', 90),
('INT116', 'SISTEMAS DE INYECCIÓN DE COMBUSTIÓN A GASOLINA Y DIESEL', 75),
('INT117', 'ESTADISTICA II', 30),
('INT118', 'TALLER', 60),
('INT119', 'TALLER AUTOMOTRIZ', 3),
('INT120', 'TALLER DE BOTÁNICA SISTEMÁTICA', 60),
('IPA001', 'CALCULO MULTIVARIABLE', 60),
('IPA005', 'DISEÑO DE EXPERIMENTOS', 75),
('IPA007', 'BIOQUÍMICA AVANZADA', 60),
('IPA008', 'INTEGRADORA I', 30),
('IPA009', 'DISEÑO POR COMPUTADORA', 45),
('IPA010', 'INGENIERÍA DE PROYECTOS', 60),
('IPA011', 'CONTROL MICROBIOLÓGICO DE PROCESOS ALIMENTARIOS', 75),
('IPA012', 'ESTANDARIZACIÓN DE PROCESOS ALIMENTARIOS', 75),
('IPA013', 'SISTEMAS DE CALIDAD', 60),
('IPA014', 'OPERACIONES UNITARIAS II', 90),
('IPA015', 'INGENIERÍA ECONÓMICA DE LA INDUSTRIA DE ALIMENTOS', 75),
('IPA016', 'DISEÑO DE PLANTAS DE ALIMENTOS', 90),
('IPA017', 'INTEGRADORA II', 30),
('IPB001', 'MATEMÁTICAS AVANZADAS', 75),
('IPB002', 'METODOLOGÍA DE LA INVESTIGACIÓN', 45),
('IPB003', 'BALANCE DE MATERIA Y ENERGÍA', 75),
('IPB004', 'GESTIÓN DE LA PRODUCCIÓN', 75),
('ITI001', 'MATEMÁTICAS PARA TI', 75),
('ITI002', 'INGENIERÍA ECONÓMICA', 45),
('ITI003', 'ADMINISTRACIÓN DE PROYECTOS DE TI I', 60),
('ITI004', 'SISTEMAS DE CALIDAD EN TI', 45),
('ITI005', 'PROGRAMACIÓN EN C#', 45),
('ITI006', 'ESTADÍSTICA APLICADA', 60),
('ITI007', 'ADMINISTRACIÓN DE PROYECTOS DE TI II', 60),
('ITI008', 'BASE DE DATOS PARA APLICACIONES', 75),
('ITI009', 'REDES CONVERGENTES', 75),
('ITI010', 'AUDITORÍA DE SISTEMAS DE TI', 60),
('ITI011', 'PROGRAMACIÓN DE APLICACIONES', 75),
('ITI012', 'APLICACIÓN DE LAS TELECOMUNICACIONES', 75),
('ITI013', 'NORMAS DE SEGURIDAD INFORMÁTICA', 45),
('ITI014', 'MODELADO DE PROCESOS DE NEGOCIOS', 45),
('ITI015', 'DESARROLLO DE APLICACIONES WEB', 90),
('ITI016', 'SEGURIDAD DE LA INFORMACIÓN', 75),
('ITI017', 'TÓPICOS SELECTOS DE TI', 45),
('ITI018', 'INTEGRADORA II', 30),
('LME001', 'INGLÉS I', 60),
('LME002', 'INGLÉS II', 60),
('LME003', 'INGLÉS III', 60),
('LME004', 'INGLÉS IV', 60),
('LME005', 'INGLÉS II', 60),
('LME006', 'INGLÉS III', 60),
('LME007', 'INGLÉS VI', 60),
('LME008', 'INGLÉS VII', 60),
('LME009', 'INGLÉS VIII', 60),
('LME010', 'INGLÉS IX', 60),
('LME011', 'INGLÉS V', 60),
('LME012', 'RELACIONES HUMANAS', 45),
('LME013', 'INGLÉS I', 90),
('LME014', 'EXPRESIÓN ESCRITA', 60),
('LME015', 'INGLÉS II', 90),
('LME016', 'EXPRESIÓN ORAL', 60),
('LME017', 'PROCESO ADMINISTRATIVO', 60),
('LME018', 'INGLÉS III', 90),
('LME019', 'TÉCNICAS DE ADMINISTRACIÓN DE LA CALIDAD', 60),
('LME020', 'ETICA PROFESIONAL', 60),
('LME021', 'EXPRESIÓN ORAL', 45),
('LME022', 'EXPRESIÓN ESCRITA', 45),
('LME023', 'INGLÉS TÉCNICO I', 60),
('LME024', 'INGLÉS TÉCNICO II', 60),
('LME025', 'INGLÉS TÉCNICO III', 60),
('LME026', 'INGLÉS TÉCNICO IV', 60),
('LME027', 'FRANCÉS I', 90),
('LME028', 'FRANCÉS II', 60),
('LME100', 'IDIOMA EXTRANJERO I', 90),
('LME101', 'EXPRESIÓN ORAL Y ESCRITA I', 75),
('LME102', 'FORMACIÓN SOCIOCULTURAL I', 45),
('LME103', 'ANÁLISIS DE COSTOS', 45),
('LME104', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN I', 45),
('LME105', 'EXPRESIÓN ORAL Y ESCRITA II', 75),
('LME106', 'FORMACIÓN SOCIOCULTURAL II', 30),
('LME107', 'IDIOMA EXTRANJERO II', 60),
('LME108', 'EXPRESIÓN ORAL II', 0),
('LME109', 'IDIOMA EXTRANJERO PARA INGENIEROS I', 60),
('LME110', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN II', 60),
('LME111', 'FORMACIÓN SOCIOCULTURAL III', 45),
('LME112', 'IDIOMA EXTRANJERO PARA INGENIEROS II', 60),
('LME113', 'FORMACIÓN SOCIOCULTURAL PARA INGENIEROS I', 45),
('LME114', 'CALIDAD', 60),
('LME115', 'FORMACIÓN SOCIOCULTURAL PARA ADMINISTRACIÓN I', 45),
('LME116', 'IDIOMA EXTRANJERO III', 60),
('LME117', 'INGLÉS I', 90),
('LME118', 'INGLÉS PARA INGENIEROS I', 60),
('LME119', 'INGLÉS PARA INGENIEROS II', 60),
('LME120', 'INGLÉS PARA INGENIEROS III', 45),
('LME121', 'INGLÉS PARA INGENIEROS IV', 45),
('LME122', 'IDIOMA EXTRANJERO IV', 45),
('LME123', 'FORMACIÓN SOCIOCULTURAL PARA ADMINISTRACIÓN II', 30),
('LME124', 'FORMACIÓN SOCIOCULTURAL PARA INGENIEROS II', 30),
('LME125', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN III', 45),
('LME126', 'FORMACIÓN SOCIOCULTURAL IV', 30),
('LME127', 'IDIOMA EXTRANJERO PARA INGENIEROS III', 45),
('LME128', 'FORMACIÓN SOCIOCULTURAL PARA INGENIEROS II', 30),
('LME129', 'IDIOMA EXTRANJERO V', 45),
('LME130', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN IV', 60),
('LME131', 'IDIOMA EXTRANJERO PARA INGENIEROS IV', 45),
('LME132', 'ASEGURAMIENTO DE LA CALIDAD', 75),
('LME133', 'EXPRESIÓN ORAL Y ESCRITA', 75),
('LME134', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN I', 100),
('LME135', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN IV', 45),
('LME136', 'IDIOMA EXTRANJERO', 60),
('LME137', 'FORMACIÓN SOCIOCULTURAL I', 75),
('LME138', 'FORMACIÓN SOCIOCULTURAL II', 75),
('LME139', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN I', 60),
('LME140', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN II', 60),
('LME141', 'IDIOMA EXTRANJERO PARA INGENIEROS III', 60),
('LME142', 'IDIOMA EXTRANJERO PARA ADMINISTRACIÓN III', 60),
('LME143', 'IDIOMA  EXTRANJERO PARA INGENIEROS IV', 60),
('LME144', 'IDIOMA EXTRANJERO I', 60),
('LME145', 'FORMACIÓN SOCIOCULTURAL I', 30),
('LME146', 'FORMACIÓN SOCIOCULTURAL III', 45),
('LME147', 'IDIOMA EXTRANJERO IV', 60),
('LME148', 'FORMACIÓN SOCIOCULTURAL IV', 45),
('LME149', 'IDIOMA EXTRANJERO V', 60),
('LME150', 'REDACCIÓN DE DOCUMENTOS EN ESPAÑOL', 60),
('LME151', 'FORMACIÓN SOCIOCULTURAL II', 45),
('LME152', 'FORMACIÓN SOCIOCULTURAL III', 30),
('MA019', 'METODOLOGIA ARTISTICA', NULL),
('MAT001', 'MATEMÁTICAS I', 90),
('MAT002', 'MATEMÁTICAS II', 90),
('MAT003', 'MATEMÁTICAS III', 90),
('MAT004', 'MATEMÁTICAS IV', 90),
('MAT005', 'MATEMÁTICAS APLICADAS I', 90),
('MAT006', 'MATEMÁTICAS APLICADAS II', 90),
('MAT007', 'MATEMÁTICAS', 75),
('MAT100', 'MATEMÁTICAS I', 105),
('MAT101', 'MATEMÁTICAS II', 105),
('MAT102', 'MATEMÁTICAS PARA INGENIEROS', 105),
('MAT103', 'MATEMÁTICAS PARA ADMINISTRACIÓN', 105),
('MAT104', 'MATEMÁTICAS I', 75),
('MAT105', 'MATEMÁTICAS II', 75),
('MAT106', 'MATEMÁTICAS PARA INGENIEROS', 60),
('MAT107', 'MATEMÁTICAS PARA ADMINISTRACIÓN', 60),
('MAT108', 'MATEMÁTICAS III', 60),
('MAT109', 'MATEMÁTICAS I', 60),
('MAT110', 'MATEMÁTICAS II', 60),
('MEC001', 'FUNDAMENTOS DE ELECTRICIDAD Y MAGNETISMO', 75),
('MEC002', 'INFORMÁTICA II', 90),
('MEC003', 'MANUFACTURA I', 90),
('MEC004', 'DIBUJO TÉCNICO INDUSTRIAL', 90),
('MEC005', 'INFORMÁTICA III', 75),
('MEC006', 'MANUFACTURA II', 90),
('MEC007', 'DINÁMICA', 60),
('MEC008', 'INTEGRADORA I', 30),
('MEC009', 'SEGURIDAD INDUSTRIAL', 60),
('MEC010', 'ANÁLISIS Y SELECCIÓN DE ELEMENTOS MECÁNICOS', 75),
('MEC011', 'INSTRUMENTACIÓN INDUSTRIAL', 75),
('MEC012', 'HIDRAÚLICA', 75),
('MEC013', 'SISTEMAS TÉRMICOS AUTOMOTRICES', 60),
('MEC014', 'SISTEMAS DEL AUTOMÓVIL I', 75),
('MEC015', 'MOTORES DE COMBUSTIÓN INTERNA A GASOLINA', 75),
('MEC016', 'MOTORES DE COMBUSTIÓN INTERNA DIESEL', 75),
('MEC017', 'ADMINISTRACIÓN DEL TALLER DE SERVICIO', 60),
('MEC018', 'ELECTRICIDAD Y ELECTRÓNICA AUTOMOTRIZ', 75),
('MEC019', 'MECÁNICA', 75),
('MEC020', 'INDUSTRIA Y MEDIO AMBIENTE', 45),
('MEC021', 'MATEMÁTICAS Y ESTADÍSTICA APLICADA', 75),
('MEC022', 'TERMODINÁMICA Y FLUÍDOS', 90),
('MEC023', 'ELECTRICIDAD Y ELECTRÓNICA', 90),
('MEC024', 'PROYECTO I', 60),
('MEC025', 'PROYECTO II', 90),
('MEC026', 'SISTEMAS DE BOMBEO Y COMPRESORES', 60),
('MEC027', 'INSTRUMENTACIÓN Y CONTROL', 90),
('MEC028', 'SISTEMAS ELECTRICOS', 79),
('MEC029', 'PROYECTO III', 105),
('MEC030', 'VEHÍCULOS AUTOMOTORES Y MOTORES DE COMBUSTIÓN', 105),
('MEC031', 'MATERIALES Y PROCESOS DE MANUFACTURA II', 105),
('MEC032', 'SEGURIDAD E HIGIENE', 45),
('MEC033', 'PROYECTO IV', 135),
('MEC034', 'MANTENIMIENTO', 90),
('MEC035', 'MAQUINARIA AGRICOLA', 75),
('MEC036', 'ORGANIZACIÓN EMPRESARIAL', 45),
('MEC037', 'SISTEMAS DE CALIDAD Y PRODUCCIÓN', 75),
('MEC038', 'AUTOMATIZACIÓN Y CONTROL', 75),
('MEC039', 'AIRE ACONDICIONADO Y REFRIGERACIÓN', 75),
('MEC040', 'INTEGRADORA II', 30),
('MEC041', 'SISTEMAS DEL AUTOMÓVIL II', 75),
('MEC042', 'SISTEMA DE ENCENDIDO ELECTRÓNICOS Y COMPUTARIZADOS', 75),
('MEC043', 'INSTRUMENTACIÓN Y CONTROL AUTOMOTRIZ', 75),
('MEC044', 'SISTEMAS DE INYECCIÓN ELECTRÓNICA DE COMBUSTIBLE', 75),
('MEC045', 'AIRE ACONDICIONADO Y REFRIGERACIÓN AUTOMOTRIZ', 60),
('MEC046', 'ESTRUCTURA Y PROPIEDADES DE LOS MATERIALES', 45),
('MEC047', 'MANUFACTURA II', 75),
('MEC048', 'TÓPICOS DE MECÁNICA', 45),
('MEC050', 'MOTORES DE COMBUSTIÓN INTERNA A DIESEL', 60),
('MEC051', 'SISTEMAS DEL AUTOMOVIL I', 60),
('MEC100', 'FÍSICA', 90),
('MEC101', 'METROLOGÍA', 60),
('MEC102', 'RESISTENCIA DE MATERIALES', 90),
('MEC103', 'DIBUJO', 90),
('MEC104', 'SISTEMAS DE BOMBEO', 60),
('MEC105', 'INSTRUMENTACIÓN Y CONTROL', 60),
('MEC106', 'MATERIALES Y PROCESOS DE MANUFACTURA', 75),
('MEC107', 'SISTEMAS ELÉCTRICOS', 60),
('MEC108', 'TERMODINÁMICA', 90),
('MEC109', 'INGENIERÍA INDUSTRIAL', 60),
('MEC110', 'VEHÍCULOS AUTOMOTORES', 60),
('MEC111', 'DISEÑO MECÁNICO', 75),
('MEC112', 'MANTENIMIENTO', 60),
('MEC113', 'CONSTRUCCIÓN', 45),
('MEC114', 'MAQUINARÍA AGRÍCOLA', 60),
('MEC115', 'SISTEMAS DE COMBUSTIÓN Y CALDERAS', 60),
('MEC116', 'CAM', 90),
('MEC117', 'PROYECTO I', 180),
('MEC118', 'AIRE ACONDICIONADO Y REFRIGERACIÓN', 45),
('MEC119', 'TERMODINÁMICA', 75),
('MEC120', 'INGENIERÍA INDUSTRIAL', 75),
('MEC121', 'SISTEMAS ELÉCTRICOS', 75),
('MEC122', 'MATERIALES Y PROCESOS DE MANUFACTURA I', 90),
('MEC123', 'VEHÍCULOS AUTOMOTORES', 75),
('MEC124', 'INSTRUMENTACIÓN INDUSTRIAL', 60),
('MEC125', 'PROYECTO', 105),
('MEC126', 'DISEÑO MECÁNICO', 90),
('MEC127', 'MATERIALES Y PROCESOS DE MANUFACTURA II', 90),
('MEC128', 'AUTOMATIZACIÓN INDUSTRIAL', 45),
('MEC129', 'ELECTRICIDAD Y MAGNETISMO', 60),
('MEC130', 'MATERIALES Y PROCESOS DE MANUFACTURA II', 75),
('MEC131', 'SISTEMAS DE BOMBEO', 75),
('MEC132', 'AUTOMATIZACIÓN INSDUSTRIAL', 60),
('MEC133', 'INGENIERÍA INDUSTRIAL', 90),
('MEC134', 'AIRE ACONDICIONADO Y REFRIGERACIÓN', 60),
('MEC135', 'MÁQUINAS ELÉCTRICAS', 60),
('MEC136', 'PROYECTO', 60),
('MEC137', 'TECNOLOGÍA DE TALLER', 30),
('MEC138', 'SISTEMAS BÁSICOS DEL AUTOMÓVIL', 45),
('MEC139', 'SISTEMAS DE INYECCIÓN DE COMBUSTIÓN A GASOLINA Y DIESEL', 75),
('MEC140', 'TECNOLOGÍA ELÉCTRICA DEL AUTOMÓVIL', 45),
('MEC141', 'MAQUINARIA AGRÍCOLA', 30),
('MEC142', 'MÁQUINAS DE COMBUSTIÓN INTERNA', 45),
('MET001', 'PROCESOS PRODUCTIVOS', 60),
('MET002', 'CIRCUITOS ELÉCTRICOS', 90),
('MET003', 'LÓGICA DE PROGRAMACIÓN', 45),
('MET004', 'SENSORES', 45),
('MET005', 'ELECTRÓNICA ANALÓGICA', 90),
('MET006', 'CONTROL DE MOTORES ELÉCTRICOS', 75),
('MET007', 'SISTEMAS HIDRÁULICOS Y NEUMÁTICOS', 90),
('MET008', 'ELEMENTOS DIMENSIONALES', 75),
('MET009', 'SISTEMAS DE CONTROL AUTOMÁTICO', 75),
('MET010', 'SISTEMAS DIGITALES', 105),
('MET011', 'CONTROLADORES LÓGICOS PROGRAMABLES', 105),
('MET012', 'SISTEMAS MECÁNICOS', 75),
('MET013', 'PLANEACIÓN DE PROYECTOS DE AUTOMATIZACIÓN', 45),
('MET014', 'INTEGRADORA I', 30),
('MET015', 'LENGUAJE DE PROGRAMACIÓN', 45),
('MET016', 'SISTEMAS LINEALES PARA AUTOMATIZACIÓN', 75),
('MET017', 'SISTEMAS DIGITALES II', 60),
('MET018', 'DISPOSITIVOS ANALÓGICOS', 90),
('MET019', 'ANÁLISIS DE CIRCUITOS ELÉCTRICOS', 75),
('MET020', 'INSTRUMENTACIÓN INDUSTRIAL', 75),
('MET021', 'PROGRAMACIÓN VISUAL', 75),
('MET022', 'INTEGRACIÓN DE SISTEMAS AUTOMÁTICOS', 105),
('MET023', 'MICROCONTROLADORES PARA INSTRUMENTACIÓN Y CONTROL', 90),
('MET024', 'INSTRUMENTACIÓN VIRTUAL', 90),
('MET025', 'INTEGRADORA II', 30),
('MET026', 'HERRAMIENTAS INFORMÁTICAS', 60),
('MET027', 'PROCESOS PRODUCTIVOS', 45),
('MET028', 'ELEMENTOS DIMENSIONALES', 60),
('MET029', 'ELECTRICIDAD Y MAGNETISMO', 45),
('MET030', 'CIRCUITOS ELÉCTRICOS', 45),
('MET031', 'CONTROL DE MOTORES I', 60),
('MET032', 'CONTROLADORES LÓGICOS PROGRAMABLES', 90),
('MET033', 'ELECTRÓNICA DIGITAL', 75),
('MET034', 'SISTEMAS MECÁNICOS I', 60),
('MET035', 'DISPOSITIVOS DIGITALES', 45),
('MM001', 'METODOLOGIA MUSICAL', NULL),
('N501', 'MATEMATICAS PARA TI', 70),
('NULL', 'NULL', 0),
('PAL001', 'MICROBIOLOGÍA', 75),
('PAL002', 'ANÁLISIS DE ALIMENTOS I', 75),
('PAL003', 'QUÍMICA DE ALIMENTOS', 105),
('PAL004', 'TECNOLOGÍA DE ALIMENTOS I', 120),
('PAL005', 'CONSERVACIÓN DE ALIMENTOS', 90),
('PAL006', 'ADMINISTRACIÓN DE LA PRODUCCIÓN', 60),
('PAL007', 'TECNOLOGÍA DE ALIMENTOS II', 105),
('PAL008', 'ESTADÍSTICA PARA EL CONTROL DE PROCESOS', 75),
('PAL009', 'INTEGRADORA I', 30),
('PAL010', 'INFORMÁTICA APLICADA PARA PROCESOS', 60),
('PAL011', 'FUNDAMENTOS DE OPERACIONES UNITARIAS', 90),
('PAL012', 'MICROBIOLOGÍA DE ALIMENTOS', 90),
('PAL013', 'ANÁLISIS DE ALIMENTOS II', 75),
('PAL014', 'TECNOLOGÍA DE ALIMENTOS III', 105),
('PAL015', 'PRINCIPIO DE COSTOS DE PRODUCCIÓN', 75),
('PAL016', 'INOCUIDAD ALIMENTARIA', 90),
('PAL017', 'TECNOLOGÍA DE ALIMENTOS IV', 120),
('PAL018', 'FORMULACIÓN Y EVALUACIÓN DE PROYECTOS', 75),
('PAL019', 'INTEGRADORA II', 30),
('PAL020', 'MICROBIOLOGÍA', 60),
('PAL021', 'QUÍMICA INORGÁNICA', 75),
('PAL022', 'QUÍMICA ORGÁNICA', 90),
('PAL023', 'CONSERVACIÓN DE ALIMENTOS', 60),
('PAL024', 'TECNOLOGÍA DE ALIMENTOS I', 90),
('PAL025', 'TECNOLOGÍA DE ALIMENTOS II', 90),
('PAL030', 'MICROBIOLOGÍA DE ALIMENTOS', 75),
('PAL031', 'ANÁLISIS DE ALIMENTOS II', 60),
('PAL032', 'FUNDAMENTOS DE OPERACIONES UNITARIAS', 75),
('TEA100', 'QUÍMICA', 90),
('TEA101', 'QUÍMICA DE ALIMENTOS', 120),
('TEA102', 'MICROBIOLOGÍA DE ALIMENTOS', 105),
('TEA103', 'EDAFOLOGÍA O TECNOLOGÍA DE LA FABRICACIÓN DE ALIMENTOS', 90),
('TEA104', 'ANÁLISIS DE ALIMENTOS', 75),
('TEA105', 'FERMENTACIONES INDUSTRIALES', 90),
('TEA106', 'MANEJO DE POSTCOSECHA DE PRODUCTOS AGROINDUSTRIALES O HIGIENE O SEGURIDAD INDUSTRIAL', 60),
('TEA107', 'TECNOLOGÍA DE FRUTAS Y HORTALIZAS U ORGANIZACIÓN Y GESTIÓN DE LA PRODUCCIÓN', 90),
('TEA108', 'CONSERVACIÓN DE ALIMENTOS', 105),
('TEA109', 'PROCESOS DE PRODUCCIÓN DE ALIMENTOS I', 120),
('TEA110', 'PROCESOS DE PRODUCCIÓN DE ALIMENTOS II', 120),
('TEA111', 'ALIMENTOS BALANCEADOS O AUTOMATIZACIÓN Y ROBÓTICA', 60),
('TEA112', 'TEMAS SELECTOS(PANIFICACIÓN, CONFITERÍA, BEBIDAS CARBONATADAS Y NO CARBONATADAS) O ECONOMÍA DE  LA EMPRESA ALIMENTARIA', 75),
('TEA113', 'OPERACIONES UNITARIAS', 90),
('TEA114', 'OPERACIONES UNITARIAS', 90),
('TEA115', 'CONSERVACIÓN DE ALIMENTOS I', 60),
('TEA116', 'ORGANIZACIÓN Y GESTIÓN DE LA PRODUCCIÓN', 90),
('TEA117', 'CONSERVACIÓN DE ALIMENTOS II', 105),
('TEA118', 'FORMULACIÓN Y EVALUACIÓN DE PROYECTOS', 60),
('TEA119', 'INOCUIDAD ALIMENTARIA', 75),
('TEA120', 'TEMAS SELECTOS', 75),
('TIC001', 'DESARROLLO DE HABILIDADES DE PENSAMIENTO LÓGICO', 60),
('TIC002', 'SOPORTE TÉCNICO', 90),
('TIC003', 'METODOLOGÍA DE LA PROGRAMACIÓN', 90),
('TIC004', 'OFIMÁTICA', 45),
('TIC005', 'FUNDAMENTOS DE REDES', 75),
('TIC006', 'DESARROLLO DE HABILIDADES DE PENSAMIENTO MATEMÁTICO', 75),
('TIC007', 'BASE DE DATOS', 90),
('TIC008', 'INTRODUCCIÓN AL ANÁLISIS Y DISEÑO DE SISTEMAS', 75),
('TIC009', 'DESARROLLO DE APLICACIONES WEB', 90),
('TIC010', 'ADMINISTRACIÓN DE LA FUNCIÓN INFORMÁTICA', 45),
('TIC011', 'MODELADO DE PROCESOS', 45),
('TIC012', 'DISEÑO GRÁFICO', 90),
('TIC013', 'MERCADOTÉCNIA', 60),
('TIC014', 'SISTEMAS OPERATIVOS', 75),
('TIC015', 'DESARROLLO DE APLICACIONES I', 90),
('TIC016', 'TÓPICOS MATEMÁTICOS', 90),
('TIC017', 'COMERCIO ELECTRÓNICO', 90),
('TIC018', 'ANIMACIÓN EN 3D', 90),
('TIC019', 'DESARROLLO DE SITIOS WEB PARA COMERCIO ELECTRÓNICO', 105),
('TIC020', 'ADMINISTRACIÓN', 60),
('TIC021', 'DESARROLLO DE APLICACIONES II', 105),
('TIC022', 'ESTRUCTURA DE DATOS', 105),
('TIC023', 'INGENIERÍA DE SOFTWARE I', 90),
('TIC024', 'ADMINISTRACIÓN DE BASE DE DATOS', 90),
('TIC025', 'ADMINISTRACIÓN DE PROYECTOS', 75),
('TIC026', 'MULTIMEDIA II', 105),
('TIC028', 'DESARROLLO DE APLICACIONES III', 105),
('TIC029', 'INGENIERIA DE  SOFTWARE II', 90),
('TIC030', 'CALIDAD EN EL DESARROLLO DE SOFTWARE', 90),
('TIC031', 'INTEGRADORA II', 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblparcial`
--

CREATE TABLE `tblparcial` (
  `intIDParcial` int(11) NOT NULL
) ;

--
-- Volcado de datos para la tabla `tblparcial`
--

INSERT INTO `tblparcial` (`intIDParcial`) VALUES
(1),
(2),
(3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblperiodo`
--

CREATE TABLE `tblperiodo` (
  `intIdPeriodo` int(11) NOT NULL,
  `vchPeriodo` varchar(8) NOT NULL
) ;

--
-- Volcado de datos para la tabla `tblperiodo`
--

INSERT INTO `tblperiodo` (`intIdPeriodo`, `vchPeriodo`) VALUES
(8, '20243');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblpracticas`
--

CREATE TABLE `tblpracticas` (
  `idPractica` int(11) NOT NULL,
  `vchNombre` varchar(255) DEFAULT NULL,
  `vchDescripcion` varchar(255) DEFAULT NULL,
  `vchInstrucciones` longtext DEFAULT NULL,
  `dtmFechaSolicitud` datetime DEFAULT NULL,
  `dtmFechaEntrega` datetime DEFAULT NULL,
  `fkActividadGlobal` int(11) DEFAULT NULL,
  `intIdActividadCurso` int(11) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `tblpracticas`
--

INSERT INTO `tblpracticas` (`idPractica`, `vchNombre`, `vchDescripcion`, `vchInstrucciones`, `dtmFechaSolicitud`, `dtmFechaEntrega`, `fkActividadGlobal`, `intIdActividadCurso`) VALUES
(474, 'Práctica 1', 'Consulta Avanzada (Dos Tablas)', '', '2024-12-15 20:39:23', NULL, 215, 417),
(475, 'Práctica 2', 'Disparadores y Procedimientos almacenados', '', '2024-12-15 20:47:27', NULL, 215, 417),
(488, 'Práctica 3', 'DISEÑO MVC  HTML', '', '2024-12-15 21:46:10', NULL, 215, 417),
(489, 'Práctica 4', 'P2: Procedimientos Almacenados y consultas', '', '2024-12-15 21:46:10', NULL, 215, 417),
(490, 'Práctica 5', 'DISEÑO MVC  HTML', '', '2024-12-15 21:47:10', NULL, 215, 417),
(491, 'Práctica 6', 'P2: Procedimientos Almacenados y consultas', '', '2024-12-15 21:47:10', NULL, 215, 417);

--
-- Disparadores `tblpracticas`
--
DELIMITER $$
CREATE TRIGGER `trg_actualizar_calificaciones` AFTER DELETE ON `tblpracticas` FOR EACH ROW BEGIN
    DECLARE actividad_valor FLOAT;
    DECLARE total_practicas INT;
    DECLARE calificacion_final FLOAT;

    -- Obtener el valor de la actividad global
    SELECT fltValor INTO actividad_valor
    FROM tblactividadesglobales
    WHERE intClvActividad = OLD.fkActividadGlobal;

    -- Insertar en logs el valor de la actividad global obtenido
    INSERT INTO log_triggers (message, value)
    VALUES (CONCAT('Valor de la actividad global obtenido: ', actividad_valor), actividad_valor);

    -- Contar el total de prácticas asociadas a la actividad después de la eliminación
    SELECT COUNT(*) INTO total_practicas
    FROM tblpracticas
    WHERE fkActividadGlobal = OLD.fkActividadGlobal
    AND intIdActividadCurso = OLD.intIdActividadCurso;

    -- Insertar en logs el total de prácticas asociadas a la actividad
    INSERT INTO log_triggers (message, value)
    VALUES (CONCAT('Total de prácticas después de la eliminación: ', total_practicas), total_practicas);

-- Verificar si hay prácticas asociadas
    IF total_practicas > 0 THEN

    -- Actualizar las calificaciones en la tabla tblcalificacionactividad para cada matrícula
    UPDATE tblcalificacionactividad AS ca
    JOIN (
        SELECT cp.vchMatricula, 
               COALESCE(SUM(cp.intCalificación), 0) AS Sumacalificaciones
        FROM tblcalificacionpractica AS cp
        JOIN tblpracticas AS p ON cp.intClvPractica = p.idPractica
        WHERE p.fkActividadGlobal = OLD.fkActividadGlobal
        AND p.intIdActividadCurso = OLD.intIdActividadCurso
        GROUP BY cp.vchMatricula
    ) AS subquery ON ca.vchMatricula = subquery.vchMatricula
    SET ca.intCalificación = (subquery.Sumacalificaciones / (total_practicas * 10)) * actividad_valor;

    -- Insertar en logs la calificación actualizada y la matrícula
    INSERT INTO log_triggers (message, value)
    SELECT CONCAT('Calificación actualizada para alumno: ', subquery.vchMatricula, 
                  ' con valor: ', (subquery.Sumacalificaciones / (total_practicas * 10)) * actividad_valor),
           (subquery.Sumacalificaciones / (total_practicas * 10)) * actividad_valor
    FROM (
        SELECT cp.vchMatricula, 
               COALESCE(SUM(cp.intCalificación), 0) AS Sumacalificaciones
        FROM tblcalificacionpractica AS cp
        JOIN tblpracticas AS p ON cp.intClvPractica = p.idPractica
        WHERE p.fkActividadGlobal = OLD.fkActividadGlobal
        AND p.intIdActividadCurso = OLD.intIdActividadCurso
        GROUP BY cp.vchMatricula
    ) AS subquery;
 ELSE
        -- Si no hay prácticas, eliminar las calificaciones de tblcalificacionactividad
 DELETE FROM tblcalificacionactividad
        WHERE tblcalificacionactividad.intActividadCurso = OLD.intIdActividadCurso;
        
       /*        
        DELETE FROM tblcalificacionactividad
        WHERE tblcalificacionactividad.intActividadCurso = OLD.fkActividadGlobal
        AND tblcalificacionactividad.vchMatricula IN (
            SELECT cp.vchMatricula
            FROM tblcalificacionpractica AS cp
            JOIN tblpracticas AS p ON cp.intClvPractica = p.idPractica
            WHERE p.fkActividadGlobal = OLD.fkActividadGlobal
            AND p.intIdActividadCurso = OLD.intIdActividadCurso
            GROUP BY cp.vchMatricula
        );*/

        -- Insertar en logs que se eliminaron las calificaciones porque no hay prácticas
        INSERT INTO log_triggers (message, value)
        VALUES (CONCAT('No se encontraron prácticas, se eliminaron calificaciones para la actividad curso: ', OLD.intIdActividadCurso), 0);
    END IF;

END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_actualizar_calificaciones_after_insert` AFTER INSERT ON `tblpracticas` FOR EACH ROW BEGIN
    DECLARE actividad_valor FLOAT;
    DECLARE total_practicas INT;
    DECLARE calificacion_final FLOAT;

    -- Obtener el valor de la actividad global
    SELECT fltValor INTO actividad_valor
    FROM tblactividadesglobales
    WHERE intClvActividad = NEW.fkActividadGlobal;

    -- Insertar en logs el valor de la actividad global obtenido
    INSERT INTO log_triggers (message, value)
    VALUES (CONCAT('Valor de la actividad global obtenido: ', actividad_valor), actividad_valor);

    -- Contar el total de prácticas asociadas a la actividad después de la inserción
    SELECT COUNT(*) INTO total_practicas
    FROM tblpracticas
    WHERE fkActividadGlobal = NEW.fkActividadGlobal
    AND intIdActividadCurso = NEW.intIdActividadCurso;

    -- Insertar en logs el total de prácticas asociadas a la actividad
    INSERT INTO log_triggers (message, value)
    VALUES (CONCAT('Total de prácticas después de la inserción: ', total_practicas), total_practicas);

    -- Actualizar las calificaciones en la tabla tblcalificacionactividad para cada matrícula
    UPDATE tblcalificacionactividad AS ca
    JOIN (
        SELECT cp.vchMatricula, 
               COALESCE(SUM(cp.intCalificación), 0) AS Sumacalificaciones
        FROM tblcalificacionpractica AS cp
        JOIN tblpracticas AS p ON cp.intClvPractica = p.idPractica
        WHERE p.fkActividadGlobal = NEW.fkActividadGlobal
        AND p.intIdActividadCurso = NEW.intIdActividadCurso
        GROUP BY cp.vchMatricula
    ) AS subquery ON ca.vchMatricula = subquery.vchMatricula
    SET ca.intCalificación = (subquery.Sumacalificaciones / (total_practicas * 10)) * actividad_valor;

    -- Insertar en logs la calificación actualizada y la matrícula
    INSERT INTO log_triggers (message, value)
    SELECT CONCAT('Calificación actualizada para alumno: ', subquery.vchMatricula, 
                  ' con valor: ', (subquery.Sumacalificaciones / (total_practicas * 10)) * actividad_valor),
           (subquery.Sumacalificaciones / (total_practicas * 10)) * actividad_valor
    FROM (
        SELECT cp.vchMatricula, 
               COALESCE(SUM(cp.intCalificación), 0) AS Sumacalificaciones
        FROM tblcalificacionpractica AS cp
        JOIN tblpracticas AS p ON cp.intClvPractica = p.idPractica
        WHERE p.fkActividadGlobal = NEW.fkActividadGlobal
        AND p.intIdActividadCurso = NEW.intIdActividadCurso
        GROUP BY cp.vchMatricula
    ) AS subquery;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblroles`
--

CREATE TABLE `tblroles` (
  `intIdRol` int(11) NOT NULL,
  `vchNombreRol` varchar(255) NOT NULL,
  `vchDescripcion` varchar(255) DEFAULT NULL,
  `fechaCreacion` timestamp NULL DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `tblroles`
--

INSERT INTO `tblroles` (`intIdRol`, `vchNombreRol`, `vchDescripcion`, `fechaCreacion`) VALUES
(1, 'Administrador', 'Administrador con control total', '2024-04-03 05:29:51'),
(2, 'Docente', 'Permisos para registrar y actualizar', '2024-04-03 05:29:51');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `log_triggers`
--
ALTER TABLE `log_triggers`
  ADD PRIMARY KEY (`log_id`);

--
-- Indices de la tabla `Notificaciones`
--
ALTER TABLE `Notificaciones`
  ADD PRIMARY KEY (`intClvNotification`),
  ADD KEY `vchMatricula` (`vchMatricula`);

--
-- Indices de la tabla `tblactividadesglobales`
--
ALTER TABLE `tblactividadesglobales`
  ADD PRIMARY KEY (`intClvActividad`),
  ADD KEY `fk_Instrumento_ActividadesGlobales` (`vchClvInstrumento`);

--
-- Indices de la tabla `tblactvidadcurso`
--
ALTER TABLE `tblactvidadcurso`
  ADD PRIMARY KEY (`intIdActividadCurso`),
  ADD KEY `fk_Periodo_ActividadCurso` (`intPeriodo`),
  ADD KEY `fk_Materia_ActividadCurso` (`intMateria`),
  ADD KEY `fk_Docente_ActividadCurso` (`intDocente`),
  ADD KEY `fk_Grupo_ActividadCurso` (`chrGrupo`),
  ADD KEY `fk_Cuatrimestre_ActividadCurso` (`intClvCuatrimestre`),
  ADD KEY `fk_Parcial_ActividadCurso` (`intParcial`),
  ADD KEY `fk_tblCarrera` (`intClvCarrera`),
  ADD KEY `fk_tblactvidadcurso_tblactividadesglobales_intClvActividad` (`intClvActividad`);

--
-- Indices de la tabla `tblalumnos`
--
ALTER TABLE `tblalumnos`
  ADD PRIMARY KEY (`vchMatricula`),
  ADD KEY `fk_Carrera_Alumno` (`intClvCarrera`);

--
-- Indices de la tabla `tblalumnosinscritos`
--
ALTER TABLE `tblalumnosinscritos`
  ADD PRIMARY KEY (`vchMatricula`),
  ADD KEY `matricula` (`vchMatricula`),
  ADD KEY `periodo` (`intPeriodo`),
  ADD KEY `grupo` (`chrGrupo`),
  ADD KEY `fk_Cuatrimestre_Inscritos` (`intClvCuatrimestre`);

--
-- Indices de la tabla `tblcalificacionactividad`
--
ALTER TABLE `tblcalificacionactividad`
  ADD PRIMARY KEY (`intIdCalificacionAct`),
  ADD UNIQUE KEY `unique_matricula_actividad` (`vchMatricula`,`intActividadCurso`),
  ADD KEY `matricula` (`vchMatricula`),
  ADD KEY `actividad` (`intActividadCurso`);

--
-- Indices de la tabla `tblcalificacionesfinales`
--
ALTER TABLE `tblcalificacionesfinales`
  ADD PRIMARY KEY (`intClvCalificaciones`),
  ADD KEY `matricula` (`vchMatricula`),
  ADD KEY `materia` (`vchClvMateria`);

--
-- Indices de la tabla `tblcalificacionpractica`
--
ALTER TABLE `tblcalificacionpractica`
  ADD PRIMARY KEY (`intidCalificacionPractica`),
  ADD UNIQUE KEY `unique_clvpractica_matricula` (`intClvPractica`,`vchMatricula`),
  ADD KEY `vchMatricula` (`vchMatricula`);

--
-- Indices de la tabla `tblcarrera`
--
ALTER TABLE `tblcarrera`
  ADD PRIMARY KEY (`intClvCarrera`);

--
-- Indices de la tabla `tblcuatrimestre`
--
ALTER TABLE `tblcuatrimestre`
  ADD PRIMARY KEY (`intClvCuatrimestre`);

--
-- Indices de la tabla `tbldepartamento`
--
ALTER TABLE `tbldepartamento`
  ADD PRIMARY KEY (`IdDepartamento`);

--
-- Indices de la tabla `tbldetallecalificacioncriterio`
--
ALTER TABLE `tbldetallecalificacioncriterio`
  ADD PRIMARY KEY (`intIdDetalleCalificacionCriterio`),
  ADD UNIQUE KEY `intIdDetalle_2` (`intIdDetalle`,`vchMatriculaAlumno`),
  ADD KEY `intIdDetalle` (`intIdDetalle`),
  ADD KEY `vchMatriculaAlumno` (`vchMatriculaAlumno`);

--
-- Indices de la tabla `tbldetalleinstrumento`
--
ALTER TABLE `tbldetalleinstrumento`
  ADD PRIMARY KEY (`intIdDetalle`),
  ADD KEY `fk_Practica_tblPracticas` (`intClvPractica`);

--
-- Indices de la tabla `tbldocentes`
--
ALTER TABLE `tbldocentes`
  ADD PRIMARY KEY (`vchMatricula`),
  ADD KEY `fk_Rol_Docente` (`intRol`);

--
-- Indices de la tabla `tblgrupo`
--
ALTER TABLE `tblgrupo`
  ADD PRIMARY KEY (`chrGrupo`);

--
-- Indices de la tabla `tblinstrumento`
--
ALTER TABLE `tblinstrumento`
  ADD PRIMARY KEY (`vchClvInstrumento`);

--
-- Indices de la tabla `tblmaterias`
--
ALTER TABLE `tblmaterias`
  ADD PRIMARY KEY (`vchClvMateria`);

--
-- Indices de la tabla `tblparcial`
--
ALTER TABLE `tblparcial`
  ADD PRIMARY KEY (`intIDParcial`);

--
-- Indices de la tabla `tblperiodo`
--
ALTER TABLE `tblperiodo`
  ADD PRIMARY KEY (`intIdPeriodo`);

--
-- Indices de la tabla `tblpracticas`
--
ALTER TABLE `tblpracticas`
  ADD PRIMARY KEY (`idPractica`),
  ADD KEY `fk_actividad_global` (`fkActividadGlobal`),
  ADD KEY `fk_ActividadCurso_Practicas` (`intIdActividadCurso`);

--
-- Indices de la tabla `tblroles`
--
ALTER TABLE `tblroles`
  ADD PRIMARY KEY (`intIdRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `log_triggers`
--
ALTER TABLE `log_triggers`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Notificaciones`
--
ALTER TABLE `Notificaciones`
  MODIFY `intClvNotification` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblactividadesglobales`
--
ALTER TABLE `tblactividadesglobales`
  MODIFY `intClvActividad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblactvidadcurso`
--
ALTER TABLE `tblactvidadcurso`
  MODIFY `intIdActividadCurso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblcalificacionactividad`
--
ALTER TABLE `tblcalificacionactividad`
  MODIFY `intIdCalificacionAct` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblcalificacionesfinales`
--
ALTER TABLE `tblcalificacionesfinales`
  MODIFY `intClvCalificaciones` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblcalificacionpractica`
--
ALTER TABLE `tblcalificacionpractica`
  MODIFY `intidCalificacionPractica` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblcarrera`
--
ALTER TABLE `tblcarrera`
  MODIFY `intClvCarrera` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbldepartamento`
--
ALTER TABLE `tbldepartamento`
  MODIFY `IdDepartamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbldetallecalificacioncriterio`
--
ALTER TABLE `tbldetallecalificacioncriterio`
  MODIFY `intIdDetalleCalificacionCriterio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbldetalleinstrumento`
--
ALTER TABLE `tbldetalleinstrumento`
  MODIFY `intIdDetalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblperiodo`
--
ALTER TABLE `tblperiodo`
  MODIFY `intIdPeriodo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tblpracticas`
--
ALTER TABLE `tblpracticas`
  MODIFY `idPractica` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Notificaciones`
--
ALTER TABLE `Notificaciones`
  ADD CONSTRAINT `Notificaciones_ibfk_1` FOREIGN KEY (`vchMatricula`) REFERENCES `tblalumnos` (`vchMatricula`);

--
-- Filtros para la tabla `tblactividadesglobales`
--
ALTER TABLE `tblactividadesglobales`
  ADD CONSTRAINT `fk_Instrumento_ActividadesGlobales` FOREIGN KEY (`vchClvInstrumento`) REFERENCES `tblinstrumento` (`vchClvInstrumento`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tblactvidadcurso`
--
ALTER TABLE `tblactvidadcurso`
  ADD CONSTRAINT `fk_Cuatrimestre_ActividadCurso` FOREIGN KEY (`intClvCuatrimestre`) REFERENCES `tblcuatrimestre` (`intClvCuatrimestre`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Docente_ActividadCurso` FOREIGN KEY (`intDocente`) REFERENCES `tbldocentes` (`vchMatricula`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grupo_ActividadCurso` FOREIGN KEY (`chrGrupo`) REFERENCES `tblgrupo` (`chrGrupo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Materia_ActividadCurso` FOREIGN KEY (`intMateria`) REFERENCES `tblmaterias` (`vchClvMateria`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Parcial_ActividadCurso` FOREIGN KEY (`intParcial`) REFERENCES `tblparcial` (`intIDParcial`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Periodo_ActividadCurso` FOREIGN KEY (`intPeriodo`) REFERENCES `tblperiodo` (`intIdPeriodo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tblCarrera` FOREIGN KEY (`intClvCarrera`) REFERENCES `tblcarrera` (`intClvCarrera`),
  ADD CONSTRAINT `fk_tblactvidadcurso_tblactividadesglobales_intClvActividad` FOREIGN KEY (`intClvActividad`) REFERENCES `tblactividadesglobales` (`intClvActividad`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `tblalumnos`
--
ALTER TABLE `tblalumnos`
  ADD CONSTRAINT `fk_Carrera_Alumno` FOREIGN KEY (`intClvCarrera`) REFERENCES `tblcarrera` (`intClvCarrera`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tblalumnosinscritos`
--
ALTER TABLE `tblalumnosinscritos`
  ADD CONSTRAINT `fk_Cuatrimestre_Inscritos` FOREIGN KEY (`intClvCuatrimestre`) REFERENCES `tblcuatrimestre` (`intClvCuatrimestre`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grupo_Inscritos` FOREIGN KEY (`chrGrupo`) REFERENCES `tblgrupo` (`chrGrupo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Matricula_Inscritos` FOREIGN KEY (`vchMatricula`) REFERENCES `tblalumnos` (`vchMatricula`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Periodo_Inscritos` FOREIGN KEY (`intPeriodo`) REFERENCES `tblperiodo` (`intIdPeriodo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tblcalificacionactividad`
--
ALTER TABLE `tblcalificacionactividad`
  ADD CONSTRAINT `fk_Actividad_Calificacion` FOREIGN KEY (`intActividadCurso`) REFERENCES `tblactvidadcurso` (`intIdActividadCurso`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Matricula_Calificacion` FOREIGN KEY (`vchMatricula`) REFERENCES `tblalumnos` (`vchMatricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tblcalificacionesfinales`
--
ALTER TABLE `tblcalificacionesfinales`
  ADD CONSTRAINT `fk_Materia_Calificaciones` FOREIGN KEY (`vchClvMateria`) REFERENCES `tblmaterias` (`vchClvMateria`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Matricula_Calificaciones` FOREIGN KEY (`vchMatricula`) REFERENCES `tblalumnos` (`vchMatricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tblcalificacionpractica`
--
ALTER TABLE `tblcalificacionpractica`
  ADD CONSTRAINT `tblcalificacionpractica_ibfk_1` FOREIGN KEY (`intClvPractica`) REFERENCES `tblpracticas` (`idPractica`),
  ADD CONSTRAINT `tblcalificacionpractica_ibfk_2` FOREIGN KEY (`vchMatricula`) REFERENCES `tblalumnos` (`vchMatricula`);

--
-- Filtros para la tabla `tbldetallecalificacioncriterio`
--
ALTER TABLE `tbldetallecalificacioncriterio`
  ADD CONSTRAINT `fk_intIdDetalle` FOREIGN KEY (`intIdDetalle`) REFERENCES `tbldetalleinstrumento` (`intIdDetalle`),
  ADD CONSTRAINT `fk_vchMatriculaAlumno` FOREIGN KEY (`vchMatriculaAlumno`) REFERENCES `tblalumnos` (`vchMatricula`);

--
-- Filtros para la tabla `tbldetalleinstrumento`
--
ALTER TABLE `tbldetalleinstrumento`
  ADD CONSTRAINT `fk_Practica_tblPracticas` FOREIGN KEY (`intClvPractica`) REFERENCES `tblpracticas` (`idPractica`);

--
-- Filtros para la tabla `tblpracticas`
--
ALTER TABLE `tblpracticas`
  ADD CONSTRAINT `fk_ActividadCurso_Practicas` FOREIGN KEY (`intIdActividadCurso`) REFERENCES `tblactvidadcurso` (`intIdActividadCurso`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_actividad_global` FOREIGN KEY (`fkActividadGlobal`) REFERENCES `tblactividadesglobales` (`intClvActividad`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
