import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  
/*   @ManyToOne(() => Responsable, { nullable: true })
  responsable: Responsable;

  @ManyToOne(() => Administrativo, { nullable: true })
  administrativo: Administrativo; */
}
