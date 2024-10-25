import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsablesModule } from 'src/responsables/responsables.module';
import { AdministrativosModule } from 'src/administrativos/administrativos.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    ResponsablesModule, // Importa el módulo de Responsable
    AdministrativosModule, // Importa el módulo de Administrativo
  ],

})
export class UsuariosModule {}
