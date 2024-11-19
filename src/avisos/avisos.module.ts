import { Module } from '@nestjs/common';
import { AvisosService } from './avisos.service';
import { AvisosController } from './avisos.controller';
import { Aviso } from './entities/aviso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { NotificacionesGateway } from 'src/notificacion/notificaciones.gateway';

@Module({
  controllers: [AvisosController],
  providers: [AvisosService,CloudinaryService,NotificacionesGateway],
  imports: [TypeOrmModule.forFeature([Aviso,Grupo,Administrativo,Responsable])],
})
export class AvisosModule {}
