import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Rol } from 'src/roles/entities/role.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Aviso } from 'src/avisos/entities/aviso.entity';
import { Incidencia } from 'src/incidencias/entities/incidencia.entity';

@Entity('administrativos')
export class Administrativo {
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

  @Column({ nullable: true })
  img: string;

  @ManyToOne(() => Rol, (rol) => rol.administrativos)
  rol: Rol;

  @OneToOne(() => Usuario, (usuario) => usuario.administrativo, { cascade: true })
  @JoinColumn()
  usuario: Usuario;

  @OneToMany(() => Aviso, aviso => aviso.administrativo)
  avisos: Aviso[]; // Lista de avisos realizados por el administrativo

  @OneToMany(() => Incidencia,incidencia => incidencia.administrativo)
  incidencias: Incidencia[];
}
