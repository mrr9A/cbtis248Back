import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from 'src/auth/auth/dto/create-auth.dto'; // Asegúrate de importar el DTO
import { Usuario } from 'src/usuarios/entities/usuario.entity'; // Asegúrate de importar la entidad Usuario
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}
  
    async login(loginDto: CreateAuthDto): Promise<any> {
      const { correo_electronico, password } = loginDto;
  
      // Busca al usuario por correo electrónico
      const usuario = await this.usuariosRepository.findOne({
        where: { correo_electronico },
      });
  
      // Verifica si el usuario existe
      if (!usuario) {
        throw new NotFoundException('El correo electrónico es incorrecto');
      }
  
      // Verifica si la contraseña es correcta
      if (usuario.password !== password) {
        throw new UnauthorizedException('La contraseña es incorrecta');
      }
  
      // Devuelve información del usuario
      return {
        id: usuario.id,
        correo_electronico: usuario.correo_electronico,
      };
    }
}
