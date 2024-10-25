import { Module } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from './entities/alumno.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { GruposModule } from 'src/grupos/grupos.module';

@Module({
  controllers: [AlumnosController],
  providers: [AlumnosService],
  imports: [TypeOrmModule.forFeature([Alumno]),GruposModule],
})
export class AlumnosModule {}
