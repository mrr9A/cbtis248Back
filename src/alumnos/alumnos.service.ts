import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private alumnosRepository: Repository<Alumno>,
  ) {}

  async findAll(): Promise<Alumno[]> {
    try {
      return await this.alumnosRepository.find({ relations: ['grupo', 'incidencias'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los alumnos');
    }
  }

  async findOne(id: number): Promise<Alumno> {
    try {
      const alumno = await this.alumnosRepository.findOne({
        where: { id },
        relations: ['grupo', 'incidencias'],
      });
      if (!alumno) throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
      return alumno;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el alumno');
    }
  }

  async create(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    try {
      const alumno = this.alumnosRepository.create(createAlumnoDto);
      return await this.alumnosRepository.save(alumno);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el alumno');
    }
  }

  async update(id: number, updateAlumnoDto: UpdateAlumnoDto): Promise<Alumno> {
    try {
      await this.alumnosRepository.update(id, updateAlumnoDto);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el alumno');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.alumnosRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el alumno');
    }
  }
}
