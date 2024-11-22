import { Module } from '@nestjs/common';
import { IncidenciasService } from './incidencias.service';
import { IncidenciasController } from './incidencias.controller';
import { Incidencia } from './entities/incidencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { NotificacionesGateway } from 'src/notificacion/notificaciones.gateway';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [IncidenciasController],
  providers: [IncidenciasService,NotificacionesGateway,CloudinaryService],
  imports: [TypeOrmModule.forFeature([Incidencia,Alumno,Grupo,TipoIncidencia,Administrativo,Responsable])],
})
export class IncidenciasModule {}
