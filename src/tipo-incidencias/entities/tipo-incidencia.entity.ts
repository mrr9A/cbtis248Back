import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Incidencia } from 'src/incidencias/entities/incidencia.entity';

@Entity('tipo_incidencias')
export class TipoIncidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => Incidencia, (incidencia) => incidencia.tipo_incidencia)
  incidencias: Incidencia[];
}
