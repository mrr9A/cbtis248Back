import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrativo } from 'src/administrativos/entities/administrativo.entity';
import { CreateAdministrativoDto } from './dto/create-administrativo.dto';
import { UpdateAdministrativoDto } from './dto/update-administrativo.dto';
import { Rol } from 'src/roles/entities/role.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AdministrativosService {
  constructor(
    @InjectRepository(Administrativo)
    private administrativosRepository: Repository<Administrativo>,
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private CloudinaryService: CloudinaryService,
  ) { }

  async findAll(): Promise<Administrativo[]> {
    try {
      return await this.administrativosRepository.find({ relations: ['rol', 'avisos', 'usuario'] });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los administrativos');
    }
  }

  async findOne(id: number): Promise<Administrativo> {
    try {
      const administrativo = await this.administrativosRepository.findOne({ where: { id }, relations: ['rol', 'avisos', 'usuario'] });
      if (!administrativo) throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
      return administrativo;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el administrativo');
    }
  }

  async create(createAdministrativoDto: CreateAdministrativoDto,
    file: Express.Multer.File,
    folder: string
  ): Promise<Administrativo> {
    const { nombre, apellido_paterno, apellido_materno, correo_electronico, num_telefono, password, rolId } = createAdministrativoDto;
    try {
      // Cargar la imagen a Cloudinary
      const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
      const imagenUrl = uploadImage.url;

      // Buscar el rol por ID
      const rol = await this.rolesRepository.findOne({ where: { id: rolId } });
      if (!rol) throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);

      // Crear y guardar el administrativo
      const administrativo = this.administrativosRepository.create({
        nombre,
        apellido_paterno,
        apellido_materno: apellido_materno || null,  // Si no se pasa, será null
        correo_electronico,
        num_telefono,
        rol,
        img: imagenUrl,
      });
      const administrativoGuardado = await this.administrativosRepository.save(administrativo);

      // Crear y guardar el usuario relacionado con el administrativo
      const usuario = this.usuariosRepository.create({
        correo_electronico,
        password,
        administrativo: administrativoGuardado,
      });
      await this.usuariosRepository.save(usuario);

      return administrativoGuardado;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el administrativo');
    }
  }


  async update(id: number, updateAdministrativoDto: UpdateAdministrativoDto): Promise<Administrativo> {
    try {
      // Verifica si el administrativo existe y carga la relación con el usuario
      const administrativo = await this.administrativosRepository.findOne({
        where: { id },
        relations: ['usuario', 'rol'],  // Carga el usuario y rol
      });

      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
      }

      // Actualiza los atributos del administrativo con los datos del DTO
      Object.assign(administrativo, updateAdministrativoDto);

      // Si se proporciona un nuevo rolId, busca y asigna el nuevo rol
      if (updateAdministrativoDto.rolId) {
        const rol = await this.rolesRepository.findOne({ where: { id: updateAdministrativoDto.rolId } });
        if (!rol) {
          throw new NotFoundException(`Rol con ID ${updateAdministrativoDto.rolId} no encontrado`);
        }
        administrativo.rol = rol; // Asigna el nuevo rol
      }

      // Verifica si el administrativo tiene un usuario asociado
      if (!administrativo.usuario) {
        // Si no tiene usuario, creamos uno nuevo
        administrativo.usuario = new Usuario();
      }

      // Actualiza el correo y la contraseña en la tabla de Usuarios
      if (updateAdministrativoDto.correo_electronico) {
        administrativo.usuario.correo_electronico = updateAdministrativoDto.correo_electronico;
      }
      if (updateAdministrativoDto.password) {
        administrativo.usuario.password = updateAdministrativoDto.password;
      }

      // Guarda los cambios en el usuario y en el administrativo
      await this.usuariosRepository.save(administrativo.usuario); // Guarda el usuario
      return await this.administrativosRepository.save(administrativo); // Guarda el administrativo actualizado
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
