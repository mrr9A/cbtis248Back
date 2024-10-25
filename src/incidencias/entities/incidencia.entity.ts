import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';

@Entity('incidencias')
export class Incidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TipoIncidencia, (tipo) => tipo.incidencias)
  tipo_incidencia: TipoIncidencia;

  @Column()
  descripcion: string;

  @ManyToOne(() => Alumno, (alumno) => alumno.incidencias)
  alumno: Alumno;

  @ManyToOne(() => Grupo, (grupo) => grupo.incidencias)
  grupo: Grupo;
}
