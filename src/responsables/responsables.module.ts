import { Module } from '@nestjs/common';
import { ResponsablesService } from './responsables.service';
import { ResponsablesController } from './responsables.controller';
import { Responsable } from './entities/responsable.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from 'src/roles/entities/role.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';

@Module({
  controllers: [ResponsablesController],
  providers: [ResponsablesService],
  imports: [TypeOrmModule.forFeature([Responsable,Rol,Alumno,AlumnoResponsable]),
],
  exports: [TypeOrmModule]
})
export class ResponsablesModule {}
