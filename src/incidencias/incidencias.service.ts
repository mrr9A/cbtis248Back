import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from 'src/incidencias/entities/incidencia.entity';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private incidenciasRepository: Repository<Incidencia>,
  ) {}

  async findAll(): Promise<Incidencia[]> {
    try {
      return await this.incidenciasRepository.find({ relations: ['grupo', 'tipo_incidencia'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las incidencias');
    }
  }

  async findOne(id: number): Promise<Incidencia> {
    try {
      const incidencia = await this.incidenciasRepository.findOneBy({ id });
      if (!incidencia) throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
      return incidencia;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener la incidencia');
    }
  }

  async create(createIncidenciaDto: CreateIncidenciaDto): Promise<Incidencia> {
    try {
      const incidencia = this.incidenciasRepository.create(createIncidenciaDto);
      return await this.incidenciasRepository.save(incidencia);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la incidencia');
    }
  }

  async update(id: number, updateIncidenciaDto: UpdateIncidenciaDto): Promise<Incidencia> {
    try {
      await this.incidenciasRepository.update(id, updateIncidenciaDto);
      return this.findOne(id);
    } catch (error) {
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
