import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import { UpdateResponsableDto } from './dto/update-responsable.dto';

@Injectable()
export class ResponsablesService {
  constructor(
    @InjectRepository(Responsable)
    private responsablesRepository: Repository<Responsable>,
  ) {}

  async findAll(): Promise<Responsable[]> {
    try {
      return await this.responsablesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los responsables');
    }
  }

  async findOne(id: number): Promise<Responsable> {
    try {
      const responsable = await this.responsablesRepository.findOneBy({ id });
      if (!responsable) throw new NotFoundException(`Responsable con ID ${id} no encontrado`);
      return responsable;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el responsable');
    }
  }

  async create(createResponsableDto: CreateResponsableDto): Promise<Responsable> {
    try {
      const responsable = this.responsablesRepository.create(createResponsableDto);
      return await this.responsablesRepository.save(responsable);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el responsable');
    }
  }

  async update(id: number, updateResponsableDto: UpdateResponsableDto): Promise<Responsable> {
    try {
      await this.responsablesRepository.update(id, updateResponsableDto);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el responsable');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.responsablesRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Responsable con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el responsable');
    }
  }
}
