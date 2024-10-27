import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

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

  @ManyToOne(() => Rol, (rol) => rol.responsable, { nullable: true })
  rol: Rol;

  @OneToOne(() => Usuario, usuario => usuario.responsable, { cascade: true, nullable: true })
  @JoinColumn()
  usuario: Usuario;
}
