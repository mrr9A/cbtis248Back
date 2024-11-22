import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsArray, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateAvisoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsOptional()  // Hacemos que este campo sea opcional
  @IsString()
  img?: string; // Campo para la URL de la imagen

  @IsNotEmpty()
  @IsString()
  grupoIds: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  administrativoId: number;
}
