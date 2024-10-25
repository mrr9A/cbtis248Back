import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import { UpdateResponsableDto } from './dto/update-responsable.dto';
import { Rol } from 'src/roles/entities/role.entity';

@Injectable()
export class ResponsablesService {
  constructor(
    @InjectRepository(Responsable)
    private responsablesRepository: Repository<Responsable>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,  // Repositorio del rol para asignar
  ) {}

  async findAll(): Promise<Responsable[]> {
    try {
      return await this.responsablesRepository.find({ relations: ['rol','alumnoResponsables'] });
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

      // Asignar rol si `rolId` está presente en el DTO
      if (createResponsableDto.rolId) {
        const rol = await this.rolRepository.findOneBy({ id: createResponsableDto.rolId });
        if (!rol) throw new NotFoundException('Rol no encontrado');
        responsable.rol = rol;
      }

      return await this.responsablesRepository.save(responsable);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el responsable');
    }
  }

/*   async update(id: number, updateResponsableDto: UpdateResponsableDto): Promise<Responsable> {
    try {
      await this.responsablesRepository.update(id, updateResponsableDto);
      return await this.findOne(id);
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
