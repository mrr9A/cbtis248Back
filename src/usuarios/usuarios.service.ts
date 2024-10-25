import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Responsable)
    private responsableRepository: Repository<Responsable>,
    @InjectRepository(Administrativo)
    private administrativoRepository: Repository<Administrativo>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    try {
      return await this.usuariosRepository.find({ relations: ['responsable', 'administrativo'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  async findOne(id: number): Promise<Usuario> {
    try {
      const usuario = await this.usuariosRepository.findOneBy({ id });
      if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      return usuario;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el usuario');
    }
  }

  // Método para crear un nuevo usuario
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const usuario = this.usuariosRepository.create(createUsuarioDto);

      // Buscar y asignar el responsable si existe responsableId en el DTO
      if (createUsuarioDto.responsableId) {
        const responsable = await this.responsableRepository.findOneBy({
          id: createUsuarioDto.responsableId,
        });
        if (!responsable) throw new NotFoundException('Responsable no encontrado');
        usuario.responsable = responsable;
      }

      // Buscar y asignar el administrativo si existe administrativoId en el DTO
      if (createUsuarioDto.administrativoId) {
        const administrativo = await this.administrativoRepository.findOneBy({
          id: createUsuarioDto.administrativoId,
        });
        if (!administrativo) throw new NotFoundException('Administrativo no encontrado');
        usuario.administrativo = administrativo;
      }

      return await this.usuariosRepository.save(usuario);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }


  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      await this.usuariosRepository.update(id, updateUsuarioDto);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.usuariosRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
}
