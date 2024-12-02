import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  correo_electronico: string;

  @Column()
  password: string;

  @OneToOne(() => Responsable, (responsable) => responsable.usuario, { nullable: true })
  responsable: Responsable;
 
  @OneToOne(() => Administrativo, (administrativo) => administrativo.usuario, { nullable: true })
  administrativo: Administrativo;
}
