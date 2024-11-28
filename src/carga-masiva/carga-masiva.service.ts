import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CargaMasivaService {
    constructor(
        @InjectRepository(Alumno) private alumnoRepo: Repository<Alumno>,
        @InjectRepository(Responsable) private responsableRepo: Repository<Responsable>,
        @InjectRepository(Grupo) private grupoRepo: Repository<Grupo>,
        @InjectRepository(TipoIncidencia) private tipoIncidenciaRepo: Repository<TipoIncidencia>,
        @InjectRepository(Rol) private rolRepo: Repository<Rol>,
        @InjectRepository(Administrativo) private administrativoRepo: Repository<Administrativo>,
        @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
        @InjectRepository(AlumnoResponsable) private alumnoResponsableRepo: Repository<AlumnoResponsable>,
    ) { }

    async cargarRoles(data: any[]): Promise<void> {
        const roles = this.rolRepo.create(data);
        await this.rolRepo.save(roles);
        console.log(`${roles.length} roles cargados correctamente.`);
    }

    async cargarAdministrativos(data: any[]): Promise<void> {
        const administrativos = [];

        for (const item of data) {
            const rol = await this.rolRepo.findOne({ where: { id: item.rolId } });

            if (!rol) {
                throw new Error(`Rol con ID ${item.rolId} no encontrado`);
            }

            const administrativo = this.administrativoRepo.create({
                ...item,
                rol, // Asigna la relación de Rol
            });

            administrativos.push(administrativo);
        }

        await this.administrativoRepo.save(administrativos);
        console.log(`${administrativos.length} administrativos cargados correctamente.`);
    }

    async cargarGrupos(data: any[]): Promise<void> {
        // Procesar el campo 'estado' para asegurarse de que sea booleano
        const grupos = data.map((item) => {
            return {
                ...item,
                estado: item.estado === 'true' || item.estado === true, // Convertir a booleano
            };
        });

        // Crear y guardar los grupos en la base de datos
        const gruposCreados = this.grupoRepo.create(grupos);
        await this.grupoRepo.save(gruposCreados);
        console.log(`${gruposCreados.length} grupos cargados correctamente.`);
    }


    async cargarAlumnos(data: any[]): Promise<void> {
        const alumnos = [];

        for (const item of data) {
            // Busca el grupo por el grupo_id proporcionado
            const grupo = await this.grupoRepo.findOne({ where: { id: item.grupo_id } });

            if (!grupo) {
                throw new Error(`Grupo con ID ${item.grupo_id} no encontrado`);
            }

            // Procesar el estado y convertirlo a booleano
            const estadoProcesado = item.estado === 'true' || item.estado === true || item.estado === 1;

            // Crea el alumno con la relación al grupo
            const alumno = this.alumnoRepo.create({
                ...item,
                estado: estadoProcesado, // Asignar el estado procesado
                grupo, // Asigna la relación al grupo
            });

            alumnos.push(alumno);
        }

        // Guarda todos los alumnos en la base de datos
        await this.alumnoRepo.save(alumnos);
        console.log(`${alumnos.length} alumnos cargados correctamente.`);
    }

    async cargarResponsables(data: any[]): Promise<void> {
        const responsables = [];

        for (const item of data) {
            // Busca el rol por el rolId proporcionado
            const rol = await this.rolRepo.findOne({ where: { id: item.rolId } });

            if (!rol) {
                throw new Error(`Rol con ID ${item.rolId} no encontrado`);
            }

            // Crea el responsable con la relación al rol
            const responsable = this.responsableRepo.create({
                ...item,
                rol, // Asigna la relación al rol
            });

            responsables.push(responsable);
        }

        // Guarda todos los responsables en la base de datos
        await this.responsableRepo.save(responsables);
        console.log(`${responsables.length} responsables cargados correctamente.`);
    }

    async cargarAlumnoResponsable(data: { alumnoId: number, responsableId: number }[]): Promise<void> {
        const relaciones = [];

        for (const item of data) {
            const alumno = await this.alumnoRepo.findOne({ where: { id: item.alumnoId } });
            const responsable = await this.responsableRepo.findOne({ where: { id: item.responsableId } });

            if (!alumno || !responsable) {
                throw new Error(`Alumno con ID ${item.alumnoId} o Responsable con ID ${item.responsableId} no encontrado`);
            }

            const relacion = this.alumnoResponsableRepo.create({
                alumno,
                responsable,
            });

            relaciones.push(relacion);
        }

        // Guarda todas las relaciones en la base de datos
        await this.alumnoResponsableRepo.save(relaciones);
        console.log(`${relaciones.length} relaciones alumno-responsable cargadas correctamente.`);
    }

    async cargarUsuarios(data: any[]): Promise<void> {
        const usuarios = [];

        for (const item of data) {
            const administrativo = item.administrativoId
                ? await this.administrativoRepo.findOne({ where: { id: item.administrativoId } })
                : null;

            const responsable = item.responsableId
                ? await this.responsableRepo.findOne({ where: { id: item.responsableId } })
                : null;

            if (item.administrativoId && !administrativo) {
                throw new Error(`Administrativo con ID ${item.administrativoId} no encontrado`);
            }

            if (item.responsableId && !responsable) {
                throw new Error(`Responsable con ID ${item.responsableId} no encontrado`);
            }

            const usuario = this.usuarioRepo.create({
                ...item,
                administrativo,
                responsable,
            });

            usuarios.push(usuario);
        }

        await this.usuarioRepo.save(usuarios); // Guardar todos los usuarios a la vez
        console.log(`${usuarios.length} usuarios cargados correctamente.`);
    }


    async cargarTiposIncidencias(data: any[]): Promise<void> {
        const tipos = this.tipoIncidenciaRepo.create(data);
        await this.tipoIncidenciaRepo.save(tipos);
        console.log(`${tipos.length} tipos de incidencias cargados correctamente, CARGA EXITOSA`);
    }
}
