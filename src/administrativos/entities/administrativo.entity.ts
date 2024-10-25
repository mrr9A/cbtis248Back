import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Rol } from 'src/roles/entities/role.entity';

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
}
