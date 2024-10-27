import { IsNotEmpty, IsEmail, IsString, IsOptional, IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

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
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  alumnoIds?: number[];
}
