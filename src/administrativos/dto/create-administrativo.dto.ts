import { IsNotEmpty, IsString, IsEmail, IsInt } from 'class-validator';

export class CreateAdministrativoDto {
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

  @IsNotEmpty()
  @IsString()
  imagen_perfil: string;

  @IsNotEmpty()
  @IsInt()
  rolId: number;
}
