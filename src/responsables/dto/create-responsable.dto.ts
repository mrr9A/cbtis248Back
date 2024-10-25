import { IsNotEmpty, IsEmail, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateResponsableDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido_paterno: string;

  @IsNotEmpty()
  @IsString()
  apellido_materno: string;

  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @IsNotEmpty()
  @IsString()
  num_telefono: string;

  @IsOptional()
  @IsInt()
  rolId?: number;  // Campo opcional para el ID de rol
}
