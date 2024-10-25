import { IsOptional, IsString, IsEmail, IsInt } from 'class-validator';

export class UpdateAdministrativoDto {
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
  @IsString()
  imagen_perfil?: string;

  @IsOptional()
  @IsInt()
  rolId?: number; // Hacer rolId opcional
}
