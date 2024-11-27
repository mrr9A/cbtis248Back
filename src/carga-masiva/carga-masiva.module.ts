import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CargaMasivaService } from './carga-masiva.service';
import { CargaMasivaController } from './carga-masiva.controller';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';

@Module({
    providers: [CargaMasivaService],
    controllers: [CargaMasivaController],
    imports: [
        TypeOrmModule.forFeature([
            Alumno,
            Responsable,
            Grupo,
            TipoIncidencia,
            Rol,
            Administrativo,
            Usuario,
            AlumnoResponsable, // Nueva entidad
        ]),
    ],
})
export class CargaMasivaModule { }
