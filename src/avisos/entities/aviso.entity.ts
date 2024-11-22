// aviso.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';

@Entity()
export class Aviso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({type: 'date', nullable: true })
  fecha: Date;
  
  @Column({ nullable: true })
  img?: string; // O con el tipo que necesites

  @ManyToMany(() => Grupo, grupo => grupo.avisos)
  @JoinTable() // Esta anotación crea una tabla intermedia para la relación
  grupos: Grupo[];

  @ManyToOne(() => Administrativo, administrativo => administrativo.avisos, { nullable: false })
  administrativo: Administrativo; // Nueva relación con Administrativo
}
