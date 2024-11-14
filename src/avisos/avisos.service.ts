import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aviso } from 'src/avisos/entities/aviso.entity';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';

@Injectable()
export class AvisosService {
  constructor(
    @InjectRepository(Aviso)
    private avisosRepository: Repository<Aviso>,
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>, // Repositorio de Grupo
    @InjectRepository(Administrativo)
    private administrativosRepository: Repository<Administrativo>, // Repositorio de Administrativo
    private CloudinaryService: CloudinaryService,
  ) { }

  async findAll(): Promise<Aviso[]> {
    try {
      return await this.avisosRepository.find({ relations: ['grupos','administrativo'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los avisos');
    }
  }

  async findOne(id: number): Promise<Aviso> {
    try {
      const aviso = await this.avisosRepository.findOne(
        {
          where: { id },
          relations: ['grupos','administrativo'],
        }
      );
      if (!aviso) throw new NotFoundException(`Aviso con ID ${id} no encontrado`);
      return aviso;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el aviso');
    }
  }

  async create(createAvisoDto: CreateAvisoDto, file: Express.Multer.File, folder: string): Promise<Aviso> {
    try {
      const { grupoIds, fecha, nombre, descripcion, administrativoId } = createAvisoDto;

      // Convertir `grupoIds` en un arreglo si es necesario
      let grupoIdsArray: number[];
      if (typeof grupoIds === 'string') {
        grupoIdsArray = JSON.parse(grupoIds);
      } else {
        grupoIdsArray = grupoIds;
      }

      // Convertir `fecha` a Date
      const fechaConvertida = new Date(fecha);
      if (isNaN(fechaConvertida.getTime())) {
        throw new BadRequestException('Formato de fecha inválido');
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
      const administrativo = await this.administrativosRepository.findOne({ where: { id: administrativoId } });
      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${administrativoId} no encontrado`);
      }


      // Crear el aviso y asignar los datos
      const aviso = this.avisosRepository.create({
        nombre,
        descripcion,
        fecha: fechaConvertida,
        grupos,
        img: imagenUrl,
        administrativo, // Asociar el administrativo encontrado
      });

      return await this.avisosRepository.save(aviso);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el aviso');
    }
  }


  async update(id: number, updateAvisoDto: UpdateAvisoDto): Promise<Aviso> {
    try {
      const { grupoIds, fecha, ...avisoData } = updateAvisoDto;

      // Busca el aviso existente
      const aviso = await this.avisosRepository.findOne({ where: { id }, relations: ['grupos'] });
      if (!aviso) {
        throw new NotFoundException(`Aviso con ID ${id} no encontrado`);
      }

      // Actualiza los datos básicos
      Object.assign(aviso, avisoData);

      // Convertir `fecha` a Date si se proporciona
      if (fecha) {
        const fechaConvertida = new Date(fecha);
        if (isNaN(fechaConvertida.getTime())) {
          throw new BadRequestException('Formato de fecha inválido');
        }
        aviso.fecha = fechaConvertida;
      }

      // Actualizar la relación de grupos si se proporciona grupoIds
      if (grupoIds) {
        const grupos = await this.gruposRepository.findByIds(grupoIds);
        if (grupos.length !== grupoIds.length) {
          throw new NotFoundException('Uno o más grupos no fueron encontrados');
        }
        aviso.grupos = grupos;
      }

      return await this.avisosRepository.save(aviso);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el aviso');
    }
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
