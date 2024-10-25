import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateResponsableDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido_paterno?: string;

  @IsOptional()
  @IsString()
  apellido_materno?: string;

  @IsOptional()
  @IsEmail()
  correo_electronico?: string;

  @IsOptional()
  @IsString()
  num_telefono?: string;

  @IsOptional()
  rolId?: number; // Campo opcional para actualizar el rol
}
