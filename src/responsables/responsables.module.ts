import { Module } from '@nestjs/common';
import { ResponsablesService } from './responsables.service';
import { ResponsablesController } from './responsables.controller';
import { Responsable } from './entities/responsable.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from 'src/roles/entities/role.entity';

@Module({
  controllers: [ResponsablesController],
  providers: [ResponsablesService],
  imports: [TypeOrmModule.forFeature([Responsable,Rol]),
],
  exports: [TypeOrmModule]
})
export class ResponsablesModule {}
