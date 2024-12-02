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

  async update(
    id: number,
    updateAdministrativoDto: UpdateAdministrativoDto,
    file: Express.Multer.File,
    folder: string
  ): Promise<Administrativo> {
    const { nombre, apellido_paterno, apellido_materno, correo_electronico, num_telefono, password, rolId } = updateAdministrativoDto;

    try {
      // Buscar el administrativo por ID
      const administrativo = await this.administrativosRepository.findOne({ where: { id }, relations: ['rol'] });
      if (!administrativo) {
        throw new NotFoundException(`Administrativo con ID ${id} no encontrado`);
      }

      // Buscar el rol por ID
      const rol = await this.rolesRepository.findOne({ where: { id: rolId } });
      if (!rol) throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);

      // Si se proporciona un archivo (imagen), cargarlo a Cloudinary
      let imagenUrl = administrativo.img; // Mantener la imagen actual si no se sube una nueva
      if (file) {
        const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
        imagenUrl = uploadImage.url; // Si se sube una nueva imagen, actualizar la URL
      }

      // Actualizar los campos del administrativo
      administrativo.nombre = nombre;
      administrativo.apellido_paterno = apellido_paterno;
      administrativo.apellido_materno = apellido_materno || null; // Si no se pasa, será null
      administrativo.correo_electronico = correo_electronico;
      administrativo.num_telefono = num_telefono;
      administrativo.rol = rol; // Actualizar el rol
      administrativo.img = imagenUrl; // Actualizar la imagen

      // Si se proporciona una nueva contraseña, actualizarla
      if (password) {
        const usuario = await this.usuariosRepository.findOne({ where: { administrativo: { id } } });
        if (usuario) {
          usuario.password = password;
          await this.usuariosRepository.save(usuario); // Guardar el nuevo password
        }
      }

      // Guardar el administrativo actualizado
      const administrativoActualizado = await this.administrativosRepository.save(administrativo);

      return administrativoActualizado;
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
