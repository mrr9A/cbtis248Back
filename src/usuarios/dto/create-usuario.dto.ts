import { IsNotEmpty, IsEmail, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsInt()
  responsableId?: number;

  @IsOptional()
  @IsInt()
  administrativoId?: number;
}
