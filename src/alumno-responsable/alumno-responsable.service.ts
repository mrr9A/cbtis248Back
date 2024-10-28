import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAlumnoResponsableDto } from './dto/create-alumno-responsable.dto';
import { UpdateAlumnoResponsableDto } from './dto/update-alumno-responsable.dto';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AlumnoResponsable } from './entities/alumno-responsable.entity';

@Injectable()
export class AlumnoResponsableService {
  constructor(
    @InjectRepository(AlumnoResponsable) // Cambia aquí para inyectar el repositorio correcto
    private alumnoRespRepository: Repository<AlumnoResponsable>,
  ) { }

  create(createAlumnoResponsableDto: CreateAlumnoResponsableDto) {
    return 'This action adds a new alumnoResponsable';
  }

  async findAll() {
    try {
      return await this.alumnoRespRepository.find({ relations: ['alumno'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los alumnos');
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} alumnoResponsable`;
  }

  update(id: number, updateAlumnoResponsableDto: UpdateAlumnoResponsableDto) {
    return `This action updates a #${id} alumnoResponsable`;
  }

  remove(id: number) {
    return `This action removes a #${id} alumnoResponsable`;
  }
}
