import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString, IsOptional, IsNumber, IsInt, IsBoolean } from 'class-validator';

export class CreateAlumnoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido_paterno: string;

  @IsOptional()  // Este campo es ahora opcional
  @IsString()
  apellido_materno: string | null;  // Permitir que sea NULL

  @IsNotEmpty()
  @IsString()
  num_control_escolar: string;

  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @IsNotEmpty()
  @IsString()
  num_telefono: string;

  @IsOptional()
  @IsString()
  imagen_perfil: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  grupoId: number;
  
  @IsOptional()
  @IsBoolean()
  estado?: boolean; // Añadir la propiedad `estado` como opcional
}
