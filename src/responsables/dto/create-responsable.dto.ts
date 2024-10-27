// DTO_CREATE.ts
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

  @IsOptional()
  @IsInt()
  rolId?: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  alumnoIds: number[];  // Nueva propiedad para recibir IDs de alumnos
}
