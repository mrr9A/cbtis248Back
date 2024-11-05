import { Module } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { AlumnosController } from './alumnos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from './entities/alumno.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { GruposModule } from 'src/grupos/grupos.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [AlumnosController],
  providers: [AlumnosService,CloudinaryService],
  imports: [TypeOrmModule.forFeature([Alumno]),GruposModule],
})
export class AlumnosModule {}
