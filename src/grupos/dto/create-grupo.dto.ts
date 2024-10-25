// create-grupo.dto.ts
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

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
}

