import { Module } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from './entities/alumno.entity';

@Module({
  controllers: [AlumnosController],
  providers: [AlumnosService],
  imports: [TypeOrmModule.forFeature([Alumno])],
})
export class AlumnosModule {}
