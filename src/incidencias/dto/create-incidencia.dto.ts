// create-incidencia.dto.ts
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateIncidenciaDto {
  @Type(() => Number)
  @IsOptional()
  tipo_incidencia_id: number;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @Type(() => Number)
  @IsOptional()
  alumno_id: number;

  @Type(() => Number)
  @IsOptional()
  grupo_id: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  administrativo_id: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;  // El campo fecha es opcional
  
  @IsOptional()  // Hacemos que este campo sea opcional
  @IsString()
  img?: string; // Campo para la URL de la imagen
}
