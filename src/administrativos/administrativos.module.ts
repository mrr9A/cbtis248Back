import { Module } from '@nestjs/common';
import { AdministrativosService } from './administrativos.service';
import { AdministrativosController } from './administrativos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrativo } from './entities/administrativo.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  controllers: [AdministrativosController],
  providers: [AdministrativosService],
  imports: [TypeOrmModule.forFeature([Administrativo,Rol,Usuario])],
  exports: [TypeOrmModule]
})
export class AdministrativosModule {}
