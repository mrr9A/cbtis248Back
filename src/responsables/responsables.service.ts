import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsable } from 'src/responsables/entities/responsable.entity';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import { UpdateResponsableDto } from './dto/update-responsable.dto';
import { Rol } from 'src/roles/entities/role.entity';
import { AlumnoResponsable } from 'src/alumno-responsable/entities/alumno-responsable.entity';
import { Alumno } from 'src/alumnos/entities/alumno.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class ResponsablesService {
  constructor(
    @InjectRepository(Responsable)
    private responsablesRepository: Repository<Responsable>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,  // Repositorio del rol para asignar
    @InjectRepository(AlumnoResponsable)
    private alumnoResponsableRepository: Repository<AlumnoResponsable>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private CloudinaryService: CloudinaryService,
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
      const responsable = await this.responsablesRepository.findOne({
        where: { id },
        relations: ['alumnoResponsables.alumno.grupo', 'alumnoResponsables.alumno.incidencias', 'alumnoResponsables.alumno.grupo.avisos', 'rol', 'alumnoResponsables.alumno.incidencias.tipo_incidencia'], // Incluye aquí las relaciones que necesites
      });

      if (!responsable) {
        throw new NotFoundException(`Responsable con ID ${id} no encontrado`);
      }

      return responsable;
    } catch (error) {
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el responsable');
    }
  }

  async create(
    createResponsableDto: CreateResponsableDto,
    file: Express.Multer.File,
    folder: string
  ): Promise<Responsable> {
    const { nombre, apellido_paterno, apellido_materno, correo_electronico, num_telefono, password, rolId, alumnoIds } = createResponsableDto;
    /* console.log('datos',alumnoIds); */

    try {
      const alumnoids = JSON.parse(alumnoIds) || [];
      // Cargar la imagen a Cloudinary
      const uploadImage = await this.CloudinaryService.uploadFile(file, folder);
      const imagenUrl = uploadImage.url;

      // Crear el responsable con la imagen
      const responsable = this.responsablesRepository.create({
        nombre,
        apellido_paterno,
        apellido_materno,
        correo_electronico,
        num_telefono,
        img: imagenUrl,  // Agregar la URL de la imagen
      });

      // Asignar el rol si se proporcionó un rolId
      if (rolId) {
        const rol = await this.rolRepository.findOneBy({ id: rolId });
        if (!rol) throw new NotFoundException('Rol no encontrado');
        responsable.rol = rol;
      }

      // Guardar el responsable en la base de datos
      const nuevoResponsable = await this.responsablesRepository.save(responsable);

      // Crear un usuario para el responsable
      const usuario = this.usuariosRepository.create({
        correo_electronico,
        password,
        responsable: nuevoResponsable,
      });
      await this.usuariosRepository.save(usuario);

      // Asignar alumnos como tutores en la tabla alumno_responsable si se proporcionaron IDs
      if (alumnoids && alumnoids.length > 0) {
        const alumnoResponsables = alumnoids.map(alumnoId => {
          return this.alumnoResponsableRepository.create({
            responsable: nuevoResponsable,
            alumno: { id: alumnoId },  // Solo necesita el ID del alumno
          });
        });
        await this.alumnoResponsableRepository.save(alumnoResponsables);
      }

      return nuevoResponsable;
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el responsable');
    }
  }

  async update(id: number, updateResponsableDto: UpdateResponsableDto): Promise<Responsable> {
    const { nombre, apellido_paterno, apellido_materno, correo_electronico, num_telefono, rolId, password, alumnoIds } = updateResponsableDto;

    try {
      console.log('Buscando responsable...');
      const responsable = await this.responsablesRepository.findOne({
        where: { id },
        relations: ['rol'],
      });
      if (!responsable) throw new NotFoundException(`Responsable con ID ${id} no encontrado`);
      /*       console.log('Responsable encontrado:', responsable); */

      // Actualizar los campos del responsable
      if (nombre) responsable.nombre = nombre;
      if (apellido_paterno) responsable.apellido_paterno = apellido_paterno;
      if (apellido_materno) responsable.apellido_materno = apellido_materno;
      if (num_telefono) responsable.num_telefono = num_telefono;

      // Actualizar el rol si es necesario
      if (rolId) {
        const rol = await this.rolRepository.findOneBy({ id: rolId });
        if (!rol) throw new NotFoundException('Rol no encontrado');
        responsable.rol = rol;
        console.log('Rol actualizado:', rol);
      }

      // Guardar los cambios en el responsable
      await this.responsablesRepository.save(responsable);

      // Actualizar o crear el usuario asociado al responsable
      let usuario = await this.usuariosRepository.findOne({
        where: { responsable: { id } },
      });


      if (!usuario) {
        usuario = this.usuariosRepository.create({
          correo_electronico,
          password,
          responsable,
        });
        console.log('Usuario creado:', usuario);
      } else {
        if (correo_electronico) usuario.correo_electronico = correo_electronico;
        if (password) usuario.password = password;
        console.log('Usuario actualizado:', usuario);
      }
      await this.usuariosRepository.save(usuario);

      // Actualizar las relaciones de tutoría en la tabla alumno_responsable
      if (alumnoIds) {
        console.log('Actualizando relaciones de alumno_responsable...');
        await this.alumnoResponsableRepository.delete({ responsable: { id } });

        const alumnoResponsables = alumnoIds.map(alumnoId =>
          this.alumnoResponsableRepository.create({
            responsable,
            alumno: { id: alumnoId },
          }),
        );
        await this.alumnoResponsableRepository.save(alumnoResponsables);
        console.log('Relaciones actualizadas con los alumnos:', alumnoIds);
      }

      return responsable;
    } catch (error) {
      console.error('Error al actualizar el responsable:', error.message);
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