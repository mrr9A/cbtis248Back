// update-incidencia.dto.ts
import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateIncidenciaDto {
  @IsOptional()
  @IsInt()
  tipo_incidencia_id?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  alumno_id?: number;

  @IsOptional()
  @IsInt()
  grupo_id?: number;
}
