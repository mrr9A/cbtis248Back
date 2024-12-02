import { PartialType } from '@nestjs/mapped-types';
import { CreateAlumnoDto } from './create-alumno.dto';
import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class UpdateAlumnoDto extends PartialType(CreateAlumnoDto) {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsNumber()
  grupoId?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsString()
  imagen_perfil?: string;
}
