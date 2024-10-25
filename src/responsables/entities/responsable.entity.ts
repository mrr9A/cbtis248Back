import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';
import { Rol } from 'src/roles/entities/role.entity';

@Entity('responsables')
export class Responsable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido_paterno: string;

  @Column({ length: 100 })
  apellido_materno: string;

  @Column()
  correo_electronico: string;

  @Column()
  num_telefono: string;

  @OneToMany(() => AlumnoResponsable, (ar) => ar.responsable)
  alumnoResponsables: AlumnoResponsable[];

  @ManyToOne(() => Rol, (rol) => rol.responsable)
  rol: Rol;
}
