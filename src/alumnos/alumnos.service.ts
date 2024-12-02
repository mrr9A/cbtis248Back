import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private alumnosRepository: Repository<Alumno>,
    @InjectRepository(Grupo)
    private gruposRepository: Repository<Grupo>,
    private CloudinaryService: CloudinaryService,
  ) { }

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
        relations: ['grupo', 'incidencias', 'incidencias.tipo_incidencia'],
      });
      if (!alumno) throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
      return alumno;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el alumno');
    }
  }

  async create(
    createAlumnoDto: CreateAlumnoDto,
    file: Express.Multer.File, // Añadido para aceptar el archivo de imagen
    folder: string // Añadido para especificar la carpeta de Cloudinary
  ): Promise<Alumno> {
    try {
      const { grupoId, estado = true, ...alumnoData } = createAlumnoDto;

      // Subir la imagen a Cloudinary
      let imagenUrl: string | null = null;
      if (file) {
        const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
        imagenUrl = uploadImage.url;
      }

      // Crear el alumno
      const alumno = this.alumnosRepository.create({
        ...alumnoData,
        estado, // Incluye el estado en la creación del alumno
        imagen_perfil: imagenUrl // Guardar la URL de la imagen en el alumno
      });

      // Asignar el grupo si se proporciona un grupoId válido
      if (grupoId) {
        const grupo = await this.gruposRepository.findOne({ where: { id: grupoId } });
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

  async update(
    id: number,
    updateAlumnoDto: UpdateAlumnoDto,
    file?: Express.Multer.File, // Imagen opcional
    folder?: string // Carpeta opcional para Cloudinary
  ): Promise<Alumno> {
    try {
      // Buscar el alumno existente
      const alumno = await this.alumnosRepository.findOne({ where: { id }, relations: ['grupo'] });
      if (!alumno) {
        throw new NotFoundException(`Alumno con id ${id} no encontrado`);
      }

      // Si no se proporciona un archivo, mantenemos el valor actual de imagen_perfil
      if (!file && !updateAlumnoDto.imagen_perfil) {
        updateAlumnoDto.imagen_perfil = alumno.imagen_perfil || ''; // Mantén la imagen actual o asigna una cadena vacía si no existe
      } else if (file && folder) {
        const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
        updateAlumnoDto.imagen_perfil = uploadImage.url; // Actualizar la URL de la imagen
      }



      // Actualizar los datos del alumno (sin modificar imagen_perfil si no se pasa archivo)
      const { grupoId, ...alumnoData } = updateAlumnoDto;
      Object.assign(alumno, alumnoData);

      // Cambiar el grupo si se proporciona un grupoId válido
      if (grupoId) {
        const grupo = await this.gruposRepository.findOne({ where: { id: grupoId } });
        if (grupo) {
          alumno.grupo = grupo;
        } else {
          console.warn('El grupo no se encontró');
          alumno.grupo = null; // O decide si debe mantenerse el grupo actual
        }
      }

      // Guardar la actualización
      return await this.alumnosRepository.save(alumno);
    } catch (error) {
      console.error('Error al actualizar el alumno:', error);
      throw new InternalServerErrorException('Error al actualizar el alumno');
    }
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
