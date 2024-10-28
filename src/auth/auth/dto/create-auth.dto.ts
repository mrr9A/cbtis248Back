import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty()
    correo_electronico: string;
  
    @IsNotEmpty()
    password: string;
}
