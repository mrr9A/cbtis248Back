import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>,
  ) {}

  async findAll(): Promise<Grupo[]> {
    try {
      return await this.gruposRepository.find({
        relations: ['alumnos','alumnos.alumnoResponsables.responsable']});
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los grupos');
    }
  }

  async findOne(id: number): Promise<Grupo> {
    try {
      const grupo = await this.gruposRepository.findOneBy({ id });
      if (!grupo) throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
      return grupo;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el grupo');
    }
  }

  async create(createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    try {
      const grupo = this.gruposRepository.create(createGrupoDto);
      return await this.gruposRepository.save(grupo);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el grupo');
    }
  }

  async update(id: number, updateGrupoDto: UpdateGrupoDto): Promise<Grupo> {
    try {
      await this.gruposRepository.update(id, updateGrupoDto);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el grupo');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.gruposRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el grupo');
    }
  }
}
