import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';
import { CreateTipoIncidenciaDto } from './dto/create-tipo-incidencia.dto';
import { UpdateTipoIncidenciaDto } from './dto/update-tipo-incidencia.dto';

@Injectable()
export class TipoIncidenciasService {
  constructor(
    @InjectRepository(TipoIncidencia)
    private tipoIncidenciasRepository: Repository<TipoIncidencia>,
  ) {}

  async findAll(): Promise<TipoIncidencia[]> {
    try {
      return await this.tipoIncidenciasRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los tipos de incidencias');
    }
  }

  async findOne(id: number): Promise<TipoIncidencia> {
    try {
      const tipoIncidencia = await this.tipoIncidenciasRepository.findOneBy({ id });
      if (!tipoIncidencia) throw new NotFoundException(`Tipo de incidencia con ID ${id} no encontrado`);
      return tipoIncidencia;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el tipo de incidencia');
    }
  }

  async create(createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<TipoIncidencia> {
    try {
      const tipoIncidencia = this.tipoIncidenciasRepository.create(createTipoIncidenciaDto);
      return await this.tipoIncidenciasRepository.save(tipoIncidencia);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el tipo de incidencia');
    }
  }

  async update(id: number, updateTipoIncidenciaDto: UpdateTipoIncidenciaDto): Promise<TipoIncidencia> {
    try {
      await this.tipoIncidenciasRepository.update(id, updateTipoIncidenciaDto);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el tipo de incidencia');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.tipoIncidenciasRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Tipo de incidencia con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el tipo de incidencia');
    }
  }
}
