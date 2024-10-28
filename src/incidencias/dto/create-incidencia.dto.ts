// create-incidencia.dto.ts
import { IsNotEmpty, IsString, IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateIncidenciaDto {
  @IsNotEmpty()
  @IsInt()
  tipo_incidencia_id: number;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsInt()
  alumno_id: number;

  @IsNotEmpty()
  @IsInt()
  grupo_id: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;  // El campo fecha es opcional
}
