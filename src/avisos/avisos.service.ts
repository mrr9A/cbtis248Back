import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aviso } from 'src/avisos/entities/aviso.entity';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';

@Injectable()
export class AvisosService {
  constructor(
    @InjectRepository(Aviso)
    private avisosRepository: Repository<Aviso>,
  ) {}

  async findAll(): Promise<Aviso[]> {
    try {
      return await this.avisosRepository.find();
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
      const aviso = this.avisosRepository.create(createAvisoDto);
      return await this.avisosRepository.save(aviso);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el aviso');
    }
  }

  async update(id: number, updateAvisoDto: UpdateAvisoDto): Promise<Aviso> {
    try {
      await this.avisosRepository.update(id, updateAvisoDto);
      return this.findOne(id);
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
