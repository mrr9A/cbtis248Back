import { IsNotEmpty, IsString, IsDate, IsArray, IsInt } from 'class-validator';

export class CreateAvisoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString() // Cambiar a cadena
  fecha: string;

  @IsArray()
  @IsInt({ each: true })
  grupoIds: number[]; // Lista de IDs de los grupos
}
