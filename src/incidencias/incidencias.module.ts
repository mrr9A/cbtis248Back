import { Module } from '@nestjs/common';
import { IncidenciasService } from './incidencias.service';
import { IncidenciasController } from './incidencias.controller';
import { Incidencia } from './entities/incidencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [IncidenciasController],
  providers: [IncidenciasService],
  imports: [TypeOrmModule.forFeature([Incidencia])],
})
export class IncidenciasModule {}
