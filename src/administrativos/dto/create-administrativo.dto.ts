import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsInt, IsOptional } from 'class-validator';

export class CreateAdministrativoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido_paterno: string;

  @IsOptional()  // Este campo es ahora opcional
  @IsString()
  apellido_materno: string | null;  // Permitir que sea NULL

  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @IsNotEmpty()
  @IsString()
  num_telefono: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  rolId?: number;

  @IsNotEmpty()
  @IsString()
  password: string;  // Nuevo campo para capturar la contraseña

  @IsOptional()  // Hacemos que este campo sea opcional
  @IsString()
  img?: string; // Campo para la URL de la imagen
}
