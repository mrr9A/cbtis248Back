import { ApiProperty  } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString, IsOptional, IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateResponsableDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido_paterno: string;

  @IsNotEmpty()
  @IsString()
  apellido_materno: string;

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
  password: string;  // Nuevo campo para la contraseña

  @IsNotEmpty()
  @IsString()
  alumnoIds: string;

  @IsOptional()  // Hacemos que este campo sea opcional
  @IsString()
  img?: string; // Campo para la URL de la imagen
}
