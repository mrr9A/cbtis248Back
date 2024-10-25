import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;

  @IsNotEmpty()
  @IsString()
  password: string;

/*   @IsNotEmpty()
  @IsString()
  tipoUsuario: string; */
}
