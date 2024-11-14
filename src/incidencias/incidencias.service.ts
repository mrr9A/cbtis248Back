import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from 'src/incidencias/entities/incidencia.entity';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { TipoIncidencia } from 'src/tipo-incidencias/entities/tipo-incidencia.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private incidenciasRepository: Repository<Incidencia>,
    @InjectRepository(Alumno)
    private alumnosRepository: Repository<Alumno>,
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>,
    @InjectRepository(TipoIncidencia)
    private tiposIncidenciaRepository: Repository<TipoIncidencia>,
    @InjectRepository(Administrativo)
    private administrativosRepository: Repository<Administrativo>, // Repositorio de Administrativo
  ) { }

  async findAll(): Promise<Incidencia[]> {
    try {
      return await this.incidenciasRepository.find({ relations: ['grupo', 'tipo_incidencia', 'alumno','administrativo'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las incidencias');
    }
  }

  async findOne(id: number): Promise<Incidencia> {
    try {
      const incidencia = await this.incidenciasRepository.findOne({ 
        where: { id },
        relations: ['grupo', 'tipo_incidencia', 'alumno','administrativo']
      });
      if (!incidencia) throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
      return incidencia;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener la incidencia');
    }
  }

  async create(createIncidenciaDto: CreateIncidenciaDto): Promise<Incidencia> {
    try {
      // Buscando los registros relacionados
      const alumno = await this.alumnosRepository.findOne({ where: { id: createIncidenciaDto.alumno_id } });
      if (!alumno) {
        throw new NotFoundException(`Alumno con ID ${createIncidenciaDto.alumno_id} no encontrado`);
      }
  
      const grupo = await this.gruposRepository.findOne({ where: { id: createIncidenciaDto.grupo_id } });
      if (!grupo) {
        throw new NotFoundException(`Grupo con ID ${createIncidenciaDto.grupo_id} no encontrado`);
      }
  
      const tipoIncidencia = await this.tiposIncidenciaRepository.findOne({ where: { id: createIncidenciaDto.tipo_incidencia_id } });
      if (!tipoIncidencia) {
        throw new NotFoundException(`Tipo de incidencia con ID ${createIncidenciaDto.tipo_incidencia_id} no encontrado`);
      }
  
      // Buscando el administrativo relacionado
      const administrativo = await this.administrativosRepository.findOne({ where: { id: createIncidenciaDto.administrativo_id } });
      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${createIncidenciaDto.administrativo_id} no encontrado`);
      }
  
      // Creando la incidencia
      const incidencia = this.incidenciasRepository.create({
        descripcion: createIncidenciaDto.descripcion,
        alumno: alumno,
        grupo: grupo,
        tipo_incidencia: tipoIncidencia,
        administrativo: administrativo, // Asignar el administrativo a la incidencia
        fecha: createIncidenciaDto.fecha ? new Date(createIncidenciaDto.fecha) : undefined,
      });
  
      return await this.incidenciasRepository.save(incidencia);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la incidencia');
    }
  }
  

  async update(id: number, updateIncidenciaDto: UpdateIncidenciaDto): Promise<Incidencia> {
    try {
      // Buscar la incidencia que se va a actualizar
      const incidencia = await this.incidenciasRepository.findOne({ where: { id }, relations: ['alumno', 'grupo', 'tipo_incidencia'] });

      if (!incidencia) {
        throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
      }

      // Verificar y asignar el nuevo alumno si se proporciona un ID
      if (updateIncidenciaDto.alumno_id) {
        const alumno = await this.alumnosRepository.findOne({ where: { id: updateIncidenciaDto.alumno_id } });
        if (!alumno) {
          throw new NotFoundException(`Alumno con ID ${updateIncidenciaDto.alumno_id} no encontrado`);
        }
        incidencia.alumno = alumno;
      }

      // Verificar y asignar el nuevo grupo si se proporciona un ID
      if (updateIncidenciaDto.grupo_id) {
        const grupo = await this.gruposRepository.findOne({ where: { id: updateIncidenciaDto.grupo_id } });
        if (!grupo) {
          throw new NotFoundException(`Grupo con ID ${updateIncidenciaDto.grupo_id} no encontrado`);
        }
        incidencia.grupo = grupo;
      }

      // Verificar y asignar el nuevo tipo de incidencia si se proporciona un ID
      if (updateIncidenciaDto.tipo_incidencia_id) {
        const tipoIncidencia = await this.tiposIncidenciaRepository.findOne({ where: { id: updateIncidenciaDto.tipo_incidencia_id } });
        if (!tipoIncidencia) {
          throw new NotFoundException(`Tipo de incidencia con ID ${updateIncidenciaDto.tipo_incidencia_id} no encontrado`);
        }
        incidencia.tipo_incidencia = tipoIncidencia;
      }

      // Actualizar la descripción si se proporciona
      if (updateIncidenciaDto.descripcion) {
        incidencia.descripcion = updateIncidenciaDto.descripcion;
      }

      // Guardar los cambios
      return await this.incidenciasRepository.save(incidencia);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la incidencia');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.incidenciasRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar la incidencia');
    }
  }
}
