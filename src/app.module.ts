import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnosModule } from './alumnos/alumnos.module';
import { ResponsablesModule } from './responsables/responsables.module';
import { GruposModule } from './grupos/grupos.module';
import { AvisosModule } from './avisos/avisos.module';
import { IncidenciasModule } from './incidencias/incidencias.module';
import { RolesModule } from './roles/roles.module';
import { TipoIncidenciasModule } from './tipo-incidencias/tipo-incidencias.module';
import { AdministrativosModule } from './administrativos/administrativos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AlumnoResponsableModule } from './alumno-responsable/alumno-responsable.module';
import { AuthModule } from './auth/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // Asegúrate de definir tu password correcta
      database: 'cbtiszimatlan',
      autoLoadEntities: true, // Cargar automáticamente entidades
      synchronize: true, // Sincronizar entidades con la base de datos (desactiva en producción)
    }),
    ConfigModule.forRoot({ isGlobal: true }), // Configuración global
    
    AlumnosModule,
    ResponsablesModule,
    GruposModule,
    AvisosModule,
    IncidenciasModule,
    RolesModule,
    TipoIncidenciasModule,
    AdministrativosModule,
    UsuariosModule,
    AlumnoResponsableModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
