import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { Grupo } from 'src/grupos/entities/grupo.entity';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private alumnosRepository: Repository<Alumno>,
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>,
  ) {}

  async findAll(): Promise<Alumno[]> {
    try {
      return await this.alumnosRepository.find({ relations: ['grupo', 'incidencias'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los alumnos');
    }
  }

  async findOne(id: number): Promise<Alumno> {
    try {
      const alumno = await this.alumnosRepository.findOne({
        where: { id },
        relations: ['grupo', 'incidencias'],
      });
      if (!alumno) throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
      return alumno;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el alumno');
    }
  }

    async create(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
      try {
        const { grupoId, ...alumnoData } = createAlumnoDto;
        console.log('Grupo ID recibido:', grupoId);
        const alumno = this.alumnosRepository.create(alumnoData);
    
        if (grupoId) {
          const grupo = await this.gruposRepository.findOne({ where: { id: grupoId } });
          console.log('Grupo encontrado:', grupo);
          if (grupo) {
            alumno.grupo = grupo;
          } else {
            console.warn('El grupo no se encontró');
          }
        }
    
        return await this.alumnosRepository.save(alumno);
      } catch (error) {
        console.error('Error al crear el alumno:', error);
        throw new InternalServerErrorException('Error al crear el alumno');
      }
    }
    
  
  async update(id: number, updateAlumnoDto: UpdateAlumnoDto): Promise<Alumno> {
    const { grupoId, ...alumnoData } = updateAlumnoDto;
    await this.alumnosRepository.update(id, alumnoData);
    const alumno = await this.findOne(id);
  
    if (grupoId) {
      const grupo = await this.gruposRepository.findOne({ where: { id: grupoId } });
      if (grupo) alumno.grupo = grupo;
    }
  
    return await this.alumnosRepository.save(alumno);
  }
  

  async remove(id: number): Promise<void> {
    try {
      const result = await this.alumnosRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el alumno');
    }
  }
}
