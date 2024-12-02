import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { Responsable } from 'src/responsables/entities/responsable.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @OneToMany(() => Administrativo, (admin) => admin.rol)
  administrativos: Administrativo[];

  @OneToMany(() => Responsable, (respon) => respon.rol)
  responsable: Responsable[];
}
