import { IsNotEmpty, IsString, IsDate, IsArray, IsInt, IsOptional } from 'class-validator';

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

  @IsOptional()  // Hacemos que este campo sea opcional
  @IsString()
  img?: string; // Campo para la URL de la imagen

  @IsNotEmpty()
  @IsString()
  grupoIds: string;
/*   @IsArray()
  @IsInt({ each: true })
  grupoIds: number[]; */ // Lista de IDs de los grupos
}
