// create-grupo.dto.ts
import { IsNotEmpty, IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateGrupoDto {
  @IsNotEmpty()
  @IsInt()
  grado: number;

  @IsNotEmpty()
  @IsString()
  grupo: string;

  @IsNotEmpty()
  @IsString()
  especialidad: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean; // Es opcional para que si no se envía, tome el valor por defecto de la entidad
}

