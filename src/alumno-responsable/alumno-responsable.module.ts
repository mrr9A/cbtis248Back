import { Module } from '@nestjs/common';
import { AlumnoResponsableService } from './alumno-responsable.service';
import { AlumnoResponsableController } from './alumno-responsable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnoResponsable } from './entities/alumno-responsable.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';

@Module({
  controllers: [AlumnoResponsableController],
  providers: [AlumnoResponsableService],
  imports: [TypeOrmModule.forFeature([AlumnoResponsable,Alumno])],
  exports: [TypeOrmModule]
})
export class AlumnoResponsableModule {}
