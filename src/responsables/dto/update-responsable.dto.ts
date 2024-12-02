// UpdateResponsableDto
import { IsOptional, IsString, IsEmail, IsInt, IsArray } from 'class-validator';
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
  @IsInt()
  rolId?: number;

  @IsOptional()
  @IsString()
  password?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  alumnoIds?: number[];

  @IsOptional()
  @IsString()
  img?: string;
}
