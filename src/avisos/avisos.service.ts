import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aviso } from 'src/avisos/entities/aviso.entity';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { NotificacionesGateway } from 'src/notificacion/notificaciones.gateway';
import { Responsable } from 'src/responsables/entities/responsable.entity';

@Injectable()
export class AvisosService {
  constructor(
    @InjectRepository(Aviso)
    private avisosRepository: Repository<Aviso>,
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>, // Repositorio de Grupo
    @InjectRepository(Administrativo)
    private administrativosRepository: Repository<Administrativo>, // Repositorio de Administrativo
    @InjectRepository(Responsable)
    private responsablesRepository: Repository<Responsable>, // Repositorio de Responsable
    private CloudinaryService: CloudinaryService,
    private notificacionesGateway: NotificacionesGateway
  ) { }

  async findAll(): Promise<Aviso[]> {
    try {
      return await this.avisosRepository.find({ relations: ['grupos', 'administrativo'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los avisos');
    }
  }

  async findOne(id: number): Promise<Aviso> {
    try {
      const aviso = await this.avisosRepository.findOne(
        {
          where: { id },
          relations: ['grupos', 'administrativo'],
        }
      );
      if (!aviso) throw new NotFoundException(`Aviso con ID ${id} no encontrado`);
      return aviso;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el aviso');
    }
  }

  async create(
    createAvisoDto: CreateAvisoDto,
    file: Express.Multer.File,
    folder: string,
  ): Promise<Aviso> {
    try {
      const { nombre, descripcion, fecha, grupoIds, administrativoId } = createAvisoDto;

      // Convertir `grupoIds` a un arreglo
      let grupoIdsArray: number[];
      try {
        grupoIdsArray = JSON.parse(grupoIds);
      } catch (error) {
        throw new BadRequestException('El formato de grupoIds no es válido');
      }

      // Cargar la imagen a Cloudinary
      const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
      const imagenUrl = uploadImage.url;

      // Buscar los grupos correspondientes a los IDs
      const grupos = await this.gruposRepository.findByIds(grupoIdsArray);
      if (grupos.length !== grupoIdsArray.length) {
        throw new NotFoundException('Uno o más grupos no fueron encontrados');
      }

      // Buscar el administrativo por ID
      const administrativo = await this.administrativosRepository.findOne({
        where: { id: administrativoId },
      });
      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${administrativoId} no encontrado`);
      }

      // Crear el aviso
      const aviso = this.avisosRepository.create({
        nombre,
        descripcion,
        fecha, // Usar la fecha convertida
        grupos,
        img: imagenUrl,
        administrativo,
      });

      // Guardar el aviso
      const avisoGuardado = await this.avisosRepository.save(aviso);

      // **Enviar notificaciones a los responsables**
      // Obtener los responsables relacionados con los grupos
      const responsables: Responsable[] = [];
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
        titulo: 'Nuevo Aviso',
        descripcion: `Se ha publicado un nuevo aviso: ${nombre}.`,
        fecha: avisoGuardado.fecha,
        img: imagenUrl,
        grupos: grupos.map((grupo) => grupo.especialidad),
      };
      console.log(payload);
      // Enviar la notificación a cada responsable
      responsables.forEach((responsable) => {
        this.notificacionesGateway.enviarNotificacion(
          `notificacion-${responsable.id}`,
          payload,
        );
      });
      return avisoGuardado;
    } catch (error) {
      console.error(error); // Para depuración
      throw new InternalServerErrorException('Error al crear el aviso');
    }
  }

  async update(
    id: string,
    updateAvisoDto: UpdateAvisoDto,
    file: Express.Multer.File,
    folder: string,
  ): Promise<Aviso> {
    const idNumber = parseInt(id, 10);  // Convertir id a number

    if (isNaN(idNumber)) {
      throw new BadRequestException('El ID del aviso no es válido');
    }

    const { nombre, descripcion, fecha, grupoIds, administrativoId } = updateAvisoDto;

    // Verificar y asegurar que grupoIds sea un arreglo de números
    let grupoIdsArray: number[] = [];
    try {
      if (Array.isArray(grupoIds)) {
        grupoIdsArray = grupoIds;
      } else if (typeof grupoIds === 'string') {
        grupoIdsArray = JSON.parse(grupoIds); // Si es string, intentar parsearlo
      } else {
        throw new BadRequestException('El formato de grupoIds no es válido');
      }
    } catch (error) {
      throw new BadRequestException('El formato de grupoIds no es válido');
    }

    const aviso = await this.avisosRepository.findOne({
      where: { id: idNumber },
      relations: ['grupos', 'administrativo'],
    });

    if (!aviso) {
      throw new NotFoundException(`Aviso con ID ${idNumber} no encontrado`);
    }

    // Actualizar los datos del aviso
    if (nombre) aviso.nombre = nombre;
    if (descripcion) aviso.descripcion = descripcion;
    if (fecha) {
      // Convertir la fecha recibida como string a un objeto Date
      aviso.fecha = new Date(fecha);
    }

    // Subir la imagen (si hay archivo)
    if (file) {
      const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
      const imagenUrl = uploadImage.url;
      aviso.img = imagenUrl; // Actualizar la imagen
    }

    // Buscar los grupos correspondientes a los IDs
    let grupos: Grupo[] = [];
    if (grupoIdsArray && grupoIdsArray.length > 0) {
      grupos = await this.gruposRepository.findByIds(grupoIdsArray);
      if (grupos.length !== grupoIdsArray.length) {
        throw new NotFoundException('Uno o más grupos no fueron encontrados');
      }
    }
    aviso.grupos = grupos;

    // Buscar el administrativo por ID
    if (administrativoId) {
      const administrativo = await this.administrativosRepository.findOne({
        where: { id: administrativoId },
      });
      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${administrativoId} no encontrado`);
      }
      aviso.administrativo = administrativo;
    }

    // Guardar el aviso actualizado
    const avisoActualizado = await this.avisosRepository.save(aviso);

    // **Enviar notificaciones a los responsables**
    // Obtener los responsables relacionados con los grupos
    const responsables: Responsable[] = [];
    for (const grupo of grupos) {
      const responsablesGrupo = await this.responsablesRepository
        .createQueryBuilder('responsable')
        .leftJoinAndSelect('responsable.alumnoResponsables', 'alumnoResponsable')
        .leftJoinAndSelect('alumnoResponsable.alumno', 'alumno')
        .where('alumno.grupo = :grupo', { grupo: grupo.id })
        .getMany();

      responsables.push(...responsablesGrupo);
    }

    // Crear el payload de la notificación
    const payload = {
      titulo: 'Aviso Actualizado',
      descripcion: `Se ha actualizado el aviso: ${nombre}.`,
      fecha: avisoActualizado.fecha,
      img: avisoActualizado.img,
      grupos: grupos.map((grupo) => grupo.especialidad),
    };

    // Enviar la notificación a cada responsable
    responsables.forEach((responsable) => {
      this.notificacionesGateway.enviarNotificacion(
        `notificacion-${responsable.id}`,
        payload,
      );
    });

    return avisoActualizado;
  } catch(error) {
    console.error(error); // Para depuración
    throw new InternalServerErrorException('Error al actualizar el aviso');
  }



  async remove(id: number): Promise<void> {
    try {
      const result = await this.avisosRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Aviso con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el aviso');
    }
  }
}
