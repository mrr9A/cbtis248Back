// aviso.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Grupo } from 'src/grupos/entities/grupo.entity';

@Entity()
export class Aviso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fecha: Date;

  @Column({ nullable: true })
  img?: string; // O con el tipo que necesites

  @ManyToMany(() => Grupo, grupo => grupo.avisos)
  @JoinTable() // Esta anotación crea una tabla intermedia para la relación
  grupos: Grupo[];
}
