import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import { UpdateResponsableDto } from './dto/update-responsable.dto';
import { Rol } from 'src/roles/entities/role.entity';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';

@Injectable()
export class ResponsablesService {
  constructor(
    @InjectRepository(Responsable)
    private responsablesRepository: Repository<Responsable>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    @InjectRepository(AlumnoResponsable)
    private alumnoResponsableRepository: Repository<AlumnoResponsable>,
    @InjectRepository(Alumno)
    private alumnoRepository: Repository<Alumno>,
  ) { }

  async findAll(): Promise<Responsable[]> {
    try {
      return await this.responsablesRepository.find({ relations: ['rol', 'alumnoResponsables'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los responsables');
    }
  }

  async findOne(id: number): Promise<Responsable> {
    try {
      const responsable = await this.responsablesRepository.findOneBy({ id });
      if (!responsable) throw new NotFoundException(`Responsable con ID ${id} no encontrado`);
      return responsable;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el responsable');
    }
  }

  async create(createResponsableDto: CreateResponsableDto): Promise<Responsable> {
    try {
      const responsable = this.responsablesRepository.create({
        nombre: createResponsableDto.nombre,
        apellido_paterno: createResponsableDto.apellido_paterno,
        apellido_materno: createResponsableDto.apellido_materno,
        correo_electronico: createResponsableDto.correo_electronico,
        num_telefono: createResponsableDto.num_telefono,
      });

      if (createResponsableDto.rolId) {
        const rol = await this.rolRepository.findOneBy({ id: createResponsableDto.rolId });
        if (!rol) throw new NotFoundException('Rol no encontrado');
        responsable.rol = rol;
      }

      const savedResponsable = await this.responsablesRepository.save(responsable);

      // Asignar alumnos como responsables tutores
      const alumnoResponsables = createResponsableDto.alumnoIds.map((alumnoId) => {
        const alumnoResponsable = new AlumnoResponsable();
        alumnoResponsable.responsable = savedResponsable;
        alumnoResponsable.alumno = { id: alumnoId } as Alumno; // Referencia al alumno
        return alumnoResponsable;
      });
      await this.alumnoResponsableRepository.save(alumnoResponsables);

      return savedResponsable;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el responsable');
    }
  }


  /*     async update(id: number, updateResponsableDto: UpdateResponsableDto): Promise<Responsable> {
        try {
          // Buscar el responsable existente
          const responsable = await this.responsablesRepository.findOneBy({ id });
          if (!responsable) throw new NotFoundException(`Responsable con ID ${id} no encontrado`);
      
          // Actualizar propiedades del responsable
          Object.assign(responsable, updateResponsableDto);
      
          // Si existe rolId en el DTO, buscar el rol y asignarlo
          if (updateResponsableDto.rolId) {
            const rol = await this.rolRepository.findOneBy({ id: updateResponsableDto.rolId });
            if (!rol) throw new NotFoundException('Rol no encontrado');
            responsable.rol = rol;
          }
      
          // Guardar los cambios en la base de datos
          return await this.responsablesRepository.save(responsable);
        } catch (error) {
          throw new InternalServerErrorException('Error al actualizar el responsable');
        }
      } */

  async update(id: number, updateResponsableDto: UpdateResponsableDto): Promise<Responsable> {
    try {
      // Buscar el responsable existente
      const responsable = await this.responsablesRepository.findOneBy({ id });
      if (!responsable) throw new NotFoundException(`Responsable con ID ${id} no encontrado`);

      // Actualizar propiedades del responsable
      Object.assign(responsable, updateResponsableDto);

      // Si existe `rolId`, buscar el rol y asignarlo
      if (updateResponsableDto.rolId) {
        const rol = await this.rolRepository.findOneBy({ id: updateResponsableDto.rolId });
        if (!rol) throw new NotFoundException('Rol no encontrado');
        responsable.rol = rol;
      }

      // Actualizar la relación con los alumnos en la tabla `alumno_responsable`
      if (updateResponsableDto.alumnoIds && updateResponsableDto.alumnoIds.length > 0) {
        // Eliminar relaciones anteriores en `alumno_responsable` para este responsable
        await this.alumnoResponsableRepository.delete({ responsable: { id } });

        // Crear nuevas relaciones
        const relacionesAlumnoResponsable = updateResponsableDto.alumnoIds.map((alumnoId) => {
          return this.alumnoResponsableRepository.create({
            alumno: { id: alumnoId },
            responsable,
          });
        });

        // Guardar las nuevas relaciones en la base de datos
        await this.alumnoResponsableRepository.save(relacionesAlumnoResponsable);
      }

      // Guardar cambios del responsable
      return await this.responsablesRepository.save(responsable);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el responsable');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.responsablesRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Responsable con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el responsable');
    }
  }
}
