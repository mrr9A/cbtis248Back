import { IsNotEmpty, IsEmail, IsString, IsOptional, IsInt, IsArray } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  password: string;  // Nuevo campo para la contraseña

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  alumnoIds?: number[]; // IDs de los alumnos asignados como tutores

}
