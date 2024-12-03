// update-aviso.dto.ts
import { IsOptional, IsString, IsDate, IsArray, IsInt, IsNumber } from 'class-validator';

export class UpdateAvisoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString() // Recibir fecha como string
  fecha?: string;

  @IsOptional()
  @IsString()
  grupoIds: string;

  @IsOptional()
  @IsNumber()
  administrativoId?: number;
}
