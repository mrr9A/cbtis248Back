import { IsNotEmpty, IsString, IsEmail, IsInt } from 'class-validator';

export class CreateAdministrativoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellidoPaterno: string;

  @IsNotEmpty()
  @IsString()
  apellidoMaterno: string;

  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsInt()
  rolId: number;
}
