import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Rol } from 'src/roles/entities/role.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

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
  imagen_perfil: string;

  @ManyToOne(() => Rol, (rol) => rol.administrativos)
  rol: Rol;

  @OneToOne(() => Usuario, (usuario) => usuario.administrativo, { cascade: true })
  @JoinColumn()
  usuario: Usuario;
}
