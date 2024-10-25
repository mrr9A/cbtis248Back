import { Module } from '@nestjs/common';
import { AdministrativosService } from './administrativos.service';
import { AdministrativosController } from './administrativos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrativo } from './entities/administrativo.entity';

@Module({
  controllers: [AdministrativosController],
  providers: [AdministrativosService],
  imports: [TypeOrmModule.forFeature([Administrativo])],
})
export class AdministrativosModule {}
