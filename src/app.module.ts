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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { NotificacionesGateway } from './notificacion/notificaciones.gateway';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Configuración global
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }), 
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
    AuthModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService,NotificacionesGateway],
})
export class AppModule { }
