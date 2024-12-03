// update-incidencia.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, IsDateString, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateIncidenciaDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  tipo_incidencia_id?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  alumno_id?: number;


  @IsOptional()
  @IsInt()
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
