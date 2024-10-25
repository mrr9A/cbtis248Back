import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateAvisoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsDate()
  fecha: Date;
}
