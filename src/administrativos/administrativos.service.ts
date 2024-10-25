import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { CreateAdministrativoDto } from './dto/create-administrativo.dto';
import { UpdateAdministrativoDto } from './dto/update-administrativo.dto';
import { Rol } from 'src/roles/entities/role.entity';

@Injectable()
export class AdministrativosService {
  constructor(
    @InjectRepository(Administrativo)
    private administrativosRepository: Repository<Administrativo>,
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Administrativo[]> {
    try {
      return await this.administrativosRepository.find({ relations: ['rol'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los administrativos');
    }
  }

  async findOne(id: number): Promise<Administrativo> {
    try {
      const administrativo = await this.administrativosRepository.findOne({ where: { id }, relations: ['rol'] });
      if (!administrativo) throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
      return administrativo;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el administrativo');
    }
  }

  async create(createAdministrativoDto: CreateAdministrativoDto): Promise<Administrativo> {
    try {
      const { rolId, ...administrativoData } = createAdministrativoDto;
      const rol = await this.rolesRepository.findOne({ where: { id: rolId } });

      if (!rol) {
        throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
      }

      const administrativo = this.administrativosRepository.create({
        ...administrativoData,
        rol, // Asigna el rol encontrado al administrativo
      });

      return await this.administrativosRepository.save(administrativo);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el administrativo');
    }
  }

  async update(id: number, updateAdministrativoDto: UpdateAdministrativoDto): Promise<Administrativo> {
    try {
      // Verifica si el administrativo existe
      const administrativo = await this.administrativosRepository.findOne({ where: { id } });
      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
      }
  
      // Actualiza los atributos del objeto administrativo con los datos del DTO
      Object.assign(administrativo, updateAdministrativoDto);
  
      // Si se proporciona un nuevo rolId, busca y asigna el nuevo rol
      if (updateAdministrativoDto.rolId) {
        const rol = await this.rolesRepository.findOne({ where: { id: updateAdministrativoDto.rolId } });
        if (!rol) {
          throw new NotFoundException(`Rol con ID ${updateAdministrativoDto.rolId} no encontrado`);
        }
        administrativo.rol = rol; // Asigna el nuevo rol
      }
  
      // Guarda el administrativo actualizado
      return await this.administrativosRepository.save(administrativo);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el administrativo');
    }
  }
  
  

  async remove(id: number): Promise<void> {
    try {
      const result = await this.administrativosRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el administrativo');
    }
  }
}
