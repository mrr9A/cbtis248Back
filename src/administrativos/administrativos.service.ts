import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { CreateAdministrativoDto } from './dto/create-administrativo.dto';
import { UpdateAdministrativoDto } from './dto/update-administrativo.dto';

@Injectable()
export class AdministrativosService {
  constructor(
    @InjectRepository(Administrativo)
    private administrativosRepository: Repository<Administrativo>,
  ) {}

  async findAll(): Promise<Administrativo[]> {
    try {
      return await this.administrativosRepository.find({ relations: ['rol'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los administrativos');
    }
  }

  async findOne(id: number): Promise<Administrativo> {
    try {
      const administrativo = await this.administrativosRepository.findOne({ where: { id }, relations: ['rol'] });
      if (!administrativo) throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
      return administrativo;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el administrativo');
    }
  }

  async create(createAdministrativoDto: CreateAdministrativoDto): Promise<Administrativo> {
    try {
      const administrativo = this.administrativosRepository.create(createAdministrativoDto);
      return await this.administrativosRepository.save(administrativo);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el administrativo');
    }
  }

  async update(id: number, updateAdministrativoDto: UpdateAdministrativoDto): Promise<Administrativo> {
    try {
      await this.administrativosRepository.update(id, updateAdministrativoDto);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el administrativo');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.administrativosRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el administrativo');
    }
  }
}
