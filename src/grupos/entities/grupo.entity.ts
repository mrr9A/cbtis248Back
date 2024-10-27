import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Incidencia } from 'src/incidencias/entities/incidencia.entity';
import { Aviso } from 'src/avisos/entities/aviso.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grado: number;

  @Column({ length: 2 })
  grupo: string;

  @Column({ length: 100 })
  especialidad: string;

  @OneToMany(() => Alumno, (alumno) => alumno.grupo)
  alumnos: Alumno[];

  @OneToMany(() => Incidencia, incidencia => incidencia.grupo)
  incidencias: Incidencia[]; // Asegúrate de que esta propiedad esté definida

  @ManyToMany(() => Aviso, aviso => aviso.grupos)
  avisos: Aviso[]; // Agregar la relación aquí
}