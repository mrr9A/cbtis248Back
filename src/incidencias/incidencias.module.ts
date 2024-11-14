import { Module } from '@nestjs/common';
import { IncidenciasService } from './incidencias.service';
import { IncidenciasController } from './incidencias.controller';
import { Incidencia } from './entities/incidencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';

@Module({
  controllers: [IncidenciasController],
  providers: [IncidenciasService],
  imports: [TypeOrmModule.forFeature([Incidencia,Alumno,Grupo,TipoIncidencia,Administrativo])],
})
export class IncidenciasModule {}
