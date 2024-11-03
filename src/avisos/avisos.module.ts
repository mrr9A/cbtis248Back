import { Module } from '@nestjs/common';
import { AvisosService } from './avisos.service';
import { AvisosController } from './avisos.controller';
import { Aviso } from './entities/aviso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [AvisosController],
  providers: [AvisosService,CloudinaryService],
  imports: [TypeOrmModule.forFeature([Aviso,Grupo])],
})
export class AvisosModule {}
