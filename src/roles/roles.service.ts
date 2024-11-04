import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from 'src/roles/entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Rol[]> {
    try {
      return await this.rolesRepository.find({relations:['administrativos']});
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles');
    }
  }

  async findOne(id: number): Promise<Rol> {
    try {
      const role = await this.rolesRepository.findOneBy({ id });
      if (!role) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }
      return role;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el rol');
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<Rol> {
    try {
      const role = this.rolesRepository.create(createRoleDto);
      return await this.rolesRepository.save(role);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el rol');
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Rol> {
    try {
      await this.rolesRepository.update(id, updateRoleDto);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el rol');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.rolesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el rol');
    }
  }
}
