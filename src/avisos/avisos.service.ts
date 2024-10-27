import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aviso } from 'src/avisos/entities/aviso.entity';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { Grupo } from 'src/grupos/entities/grupo.entity';

@Injectable()
export class AvisosService {
  constructor(
    @InjectRepository(Aviso)
    private avisosRepository: Repository<Aviso>,
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>, // Repositorio de Grupo
  ) {}

  async findAll(): Promise<Aviso[]> {
    try {
      return await this.avisosRepository.find({ relations: ['grupos'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los avisos');
    }
  }

  async findOne(id: number): Promise<Aviso> {
    try {
      const aviso = await this.avisosRepository.findOneBy({ id });
      if (!aviso) throw new NotFoundException(`Aviso con ID ${id} no encontrado`);
      return aviso;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el aviso');
    }
  }

  async create(createAvisoDto: CreateAvisoDto): Promise<Aviso> {
    try {
      const { grupoIds, fecha, ...avisoData } = createAvisoDto;
  
      // Convertir `fecha` a Date
      const fechaConvertida = new Date(fecha);
      if (isNaN(fechaConvertida.getTime())) {
        throw new BadRequestException('Formato de fecha inválido');
      }
  
      // Busca los grupos correspondientes a los IDs
      const grupos = await this.gruposRepository.findByIds(grupoIds);
      if (grupos.length !== grupoIds.length) {
        throw new NotFoundException('Uno o más grupos no fueron encontrados');
      }
  
      // Crea el aviso y asigna la fecha y los grupos
      const aviso = this.avisosRepository.create({
        ...avisoData,
        fecha: fechaConvertida,
        grupos,
      });
  
      return await this.avisosRepository.save(aviso);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el aviso');
    }
  }

// avisos.service.ts
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
