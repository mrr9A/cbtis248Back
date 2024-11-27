import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Responsable } from 'src/responsables/entities/responsable.entity';

@Entity('alumno_responsable')
export class AlumnoResponsable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Alumno, (alumno) => alumno.alumnoResponsables, { eager: true })
  alumno: Alumno;

  @ManyToOne(() => Responsable, (responsable) => responsable.alumnoResponsables, { eager: true })
  responsable: Responsable;
}
