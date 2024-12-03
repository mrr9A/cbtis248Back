import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from 'src/incidencias/entities/incidencia.entity';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { NotificacionesGateway } from 'src/notificacion/notificaciones.gateway';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private incidenciasRepository: Repository<Incidencia>,
    @InjectRepository(Alumno)
    private alumnosRepository: Repository<Alumno>,
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>,
    @InjectRepository(TipoIncidencia)
    private tiposIncidenciaRepository: Repository<TipoIncidencia>,
    @InjectRepository(Administrativo)
    private administrativosRepository: Repository<Administrativo>, // Repositorio de Administrativo
    @InjectRepository(Responsable)
    private responsablesRepository: Repository<Responsable>, // Repositorio de Administrativo
    private notificacionesGateway: NotificacionesGateway,
    private CloudinaryService: CloudinaryService
  ) { }

  async findAll(): Promise<Incidencia[]> {
    try {
      return await this.incidenciasRepository.find({ relations: ['grupo', 'tipo_incidencia', 'alumno', 'administrativo'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las incidencias');
    }
  }

  async findOne(id: number): Promise<Incidencia> {
    try {
      const incidencia = await this.incidenciasRepository.findOne({
        where: { id },
        relations: ['grupo', 'tipo_incidencia', 'alumno', 'administrativo']
      });
      if (!incidencia) throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
      return incidencia;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener la incidencia');
    }
  }

  async create(
    createIncidenciaDto: CreateIncidenciaDto,
    file: Express.Multer.File,
    folder: string,
  ): Promise<Incidencia> {
    try {
      // Buscar los registros relacionados
      const alumno = await this.alumnosRepository.findOne({ where: { id: createIncidenciaDto.alumno_id } });
      if (!alumno) {
        throw new NotFoundException(`Alumno con ID ${createIncidenciaDto.alumno_id} no encontrado`);
      }

      const grupo = await this.gruposRepository.findOne({ where: { id: createIncidenciaDto.grupo_id } });
      if (!grupo) {
        throw new NotFoundException(`Grupo con ID ${createIncidenciaDto.grupo_id} no encontrado`);
      }

      const tipoIncidencia = await this.tiposIncidenciaRepository.findOne({ where: { id: createIncidenciaDto.tipo_incidencia_id } });
      if (!tipoIncidencia) {
        throw new NotFoundException(`Tipo de incidencia con ID ${createIncidenciaDto.tipo_incidencia_id} no encontrado`);
      }

      const administrativo = await this.administrativosRepository.findOne({ where: { id: createIncidenciaDto.administrativo_id } });
      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${createIncidenciaDto.administrativo_id} no encontrado`);
      }

      // Cargar la imagen a Cloudinary
      const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
      const imagenUrl = uploadImage.url;

      // Crear la incidencia
      const incidencia = this.incidenciasRepository.create({
        descripcion: createIncidenciaDto.descripcion,
        alumno,
        grupo,
        img: imagenUrl, // Asignar la URL de la imagen
        tipo_incidencia: tipoIncidencia,
        administrativo, // Asociar el administrativo encontrado
        fecha: createIncidenciaDto.fecha ? new Date(createIncidenciaDto.fecha) : undefined,
      });

      const incidenciaGuardada = await this.incidenciasRepository.save(incidencia);

      // **Enviar notificaciones a los responsables**
      const responsables: Responsable[] = [];
      const grupos = [grupo]; // Considerando un solo grupo, ajustar si aplica a más

      for (const grupo of grupos) {
        const responsablesGrupo = await this.responsablesRepository
          .createQueryBuilder('responsable')
          .leftJoinAndSelect('responsable.alumnoResponsables', 'alumnoResponsable') // Relación intermedia
          .leftJoinAndSelect('alumnoResponsable.alumno', 'alumno') // Relación hacia Alumno
          .where('alumno.grupo = :grupo', { grupo: grupo.id })
          .getMany();

        responsables.push(...responsablesGrupo);
      }

      // Crear el payload de la notificación
      const payload = {
        titulo: 'Nueva Incidencia Registrada',
        descripcion: `Se ha registrado una nueva incidencia para el alumno ${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}.`,
        fecha: incidenciaGuardada.fecha, // Fecha de la incidencia
        img: imagenUrl, // Incluir imagen si aplica
        grupos: grupos.map((grupo) => grupo.especialidad), // Nombre o especialidad del grupo
      };
      console.log(payload);
      // Enviar la notificación a cada responsable
      responsables.forEach((responsable) => {
        this.notificacionesGateway.enviarNotificacion(`notificacion-${responsable.id}`, payload);

        // Imprimir en consola que se ha enviado la notificación correctamente
        console.log(`Notificación enviada correctamente a Responsable ID: ${responsable.id}`);
      });

      return incidenciaGuardada;
    } catch (error) {
      console.error(error); // Para depuración
      throw new InternalServerErrorException('Error al crear la incidencia');
    }
  }


  /*   async update(id: number, updateIncidenciaDto: UpdateIncidenciaDto): Promise<Incidencia> {
      try {
        // Buscar la incidencia que se va a actualizar
        const incidencia = await this.incidenciasRepository.findOne({ where: { id }, relations: ['alumno', 'grupo', 'tipo_incidencia'] });
  
        if (!incidencia) {
          throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
        }
  
        // Verificar y asignar el nuevo alumno si se proporciona un ID
        if (updateIncidenciaDto.alumno_id) {
          const alumno = await this.alumnosRepository.findOne({ where: { id: updateIncidenciaDto.alumno_id } });
          if (!alumno) {
            throw new NotFoundException(`Alumno con ID ${updateIncidenciaDto.alumno_id} no encontrado`);
          }
          incidencia.alumno = alumno;
        }
  
        // Verificar y asignar el nuevo grupo si se proporciona un ID
        if (updateIncidenciaDto.grupo_id) {
          const grupo = await this.gruposRepository.findOne({ where: { id: updateIncidenciaDto.grupo_id } });
          if (!grupo) {
            throw new NotFoundException(`Grupo con ID ${updateIncidenciaDto.grupo_id} no encontrado`);
          }
          incidencia.grupo = grupo;
        }
  
        // Verificar y asignar el nuevo tipo de incidencia si se proporciona un ID
        if (updateIncidenciaDto.tipo_incidencia_id) {
          const tipoIncidencia = await this.tiposIncidenciaRepository.findOne({ where: { id: updateIncidenciaDto.tipo_incidencia_id } });
          if (!tipoIncidencia) {
            throw new NotFoundException(`Tipo de incidencia con ID ${updateIncidenciaDto.tipo_incidencia_id} no encontrado`);
          }
          incidencia.tipo_incidencia = tipoIncidencia;
        }
  
        // Actualizar la descripción si se proporciona
        if (updateIncidenciaDto.descripcion) {
          incidencia.descripcion = updateIncidenciaDto.descripcion;
        }
  
        // Guardar los cambios
        return await this.incidenciasRepository.save(incidencia);
      } catch (error) {
        throw new InternalServerErrorException('Error al actualizar la incidencia');
      }
    } */

  private async obtenerResponsablesPorGrupo(grupoId: number): Promise<Responsable[]> {
    return this.responsablesRepository
      .createQueryBuilder('responsable')
      .leftJoinAndSelect('responsable.alumnoResponsables', 'alumnoResponsable')
      .leftJoinAndSelect('alumnoResponsable.alumno', 'alumno')
      .where('alumno.grupo = :grupoId', { grupoId })
      .getMany();
  }

  async update(
    id: number,
    updateIncidenciaDto: UpdateIncidenciaDto,
    file?: Express.Multer.File,
    folder?: string,
  ): Promise<Incidencia> {
    try {
      // Buscar la incidencia existente
      const incidencia = await this.incidenciasRepository.findOne({ where: { id } });
      if (!incidencia) {
        throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
      }
  
      // Actualizar los campos si se proporcionan
      if (updateIncidenciaDto.alumno_id) {
        const alumno = await this.alumnosRepository.findOne({ where: { id: updateIncidenciaDto.alumno_id } });
        if (!alumno) {
          throw new NotFoundException(`Alumno con ID ${updateIncidenciaDto.alumno_id} no encontrado`);
        }
        incidencia.alumno = alumno;
      }
  
      if (updateIncidenciaDto.grupo_id) {
        const grupo = await this.gruposRepository.findOne({ where: { id: updateIncidenciaDto.grupo_id } });
        if (!grupo) {
          throw new NotFoundException(`Grupo con ID ${updateIncidenciaDto.grupo_id} no encontrado`);
        }
        incidencia.grupo = grupo;
      }
  
      if (updateIncidenciaDto.tipo_incidencia_id) {
        const tipoIncidencia = await this.tiposIncidenciaRepository.findOne({ where: { id: updateIncidenciaDto.tipo_incidencia_id } });
        if (!tipoIncidencia) {
          throw new NotFoundException(`Tipo de incidencia con ID ${updateIncidenciaDto.tipo_incidencia_id} no encontrado`);
        }
        incidencia.tipo_incidencia = tipoIncidencia;
      }
  
      if (updateIncidenciaDto.administrativo_id) {
        const administrativo = await this.administrativosRepository.findOne({ where: { id: updateIncidenciaDto.administrativo_id } });
        if (!administrativo) {
          throw new NotFoundException(`Administrativo con ID ${updateIncidenciaDto.administrativo_id} no encontrado`);
        }
        incidencia.administrativo = administrativo;
      }
  
      // Actualizar imagen si se proporciona
      if (file && folder) {
        const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
        incidencia.img = uploadImage.url;
      }
  
      // Actualizar otros campos
      incidencia.descripcion = updateIncidenciaDto.descripcion || incidencia.descripcion;
      incidencia.fecha = updateIncidenciaDto.fecha ? new Date(updateIncidenciaDto.fecha) : incidencia.fecha;
  
      // Guardar los cambios
      const incidenciaActualizada = await this.incidenciasRepository.save(incidencia);
  
      // Notificar responsables
      const responsables = await this.obtenerResponsablesPorGrupo(incidencia.grupo.id);
  
      const payload = {
        titulo: 'Incidencia Actualizada',
        descripcion: `La incidencia del alumno ${incidencia.alumno.nombre} ${incidencia.alumno.apellido_paterno} ha sido actualizada.`,
        fecha: incidenciaActualizada.fecha,
        img: incidenciaActualizada.img,
        grupos: [incidencia.grupo.especialidad],
      };
  
      responsables.forEach((responsable) => {
        this.notificacionesGateway.enviarNotificacion(`notificacion-${responsable.id}`, payload);
        console.log(`Notificación enviada a Responsable ID: ${responsable.id}`);
      });
  
      return incidenciaActualizada;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar la incidencia');
    }
  }
  

  async remove(id: number): Promise<void> {
    try {
      const result = await this.incidenciasRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar la incidencia');
    }
  }
}
