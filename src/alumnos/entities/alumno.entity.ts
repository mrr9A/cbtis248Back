import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Incidencia } from 'src/incidencias/entities/incidencia.entity';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';

@Entity('alumnos')
export class Alumno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido_paterno: string;

  @Column({ length: 100, nullable: true })  // Permitir que sea NULL
  apellido_materno: string | null;

  @Column({ unique: true })
  num_control_escolar: string;

  @Column()
  correo_electronico: string;

  @Column()
  num_telefono: string;

  @Column({ nullable: true })
  imagen_perfil: string;

  @Column({ default: true }) // Añadir el estado con valor por defecto `true`
  estado: boolean;
  
  @ManyToOne(() => Grupo, (grupo) => grupo.alumnos, { eager: false })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @OneToMany(() => Incidencia, (incidencia) => incidencia.alumno, { eager: false })
  incidencias: Incidencia[];

  @OneToMany(() => AlumnoResponsable, alumnoResponsables => alumnoResponsables.alumno)
  alumnoResponsables: AlumnoResponsable[];

}
