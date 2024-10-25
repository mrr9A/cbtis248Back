import { Injectable } from '@nestjs/common';
import { CreateAlumnoResponsableDto } from './dto/create-alumno-responsable.dto';
import { UpdateAlumnoResponsableDto } from './dto/update-alumno-responsable.dto';

@Injectable()
export class AlumnoResponsableService {
  create(createAlumnoResponsableDto: CreateAlumnoResponsableDto) {
    return 'This action adds a new alumnoResponsable';
  }

  findAll() {
    return `This action returns all alumnoResponsable`;
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
