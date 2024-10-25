import { Module } from '@nestjs/common';
import { TipoIncidenciasService } from './tipo-incidencias.service';
import { TipoIncidenciasController } from './tipo-incidencias.controller';
import { TipoIncidencia } from './entities/tipo-incidencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TipoIncidenciasController],
  providers: [TipoIncidenciasService],
  imports: [TypeOrmModule.forFeature([TipoIncidencia])],
})
export class TipoIncidenciasModule {}
