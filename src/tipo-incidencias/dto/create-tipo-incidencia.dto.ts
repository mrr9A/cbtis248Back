import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoIncidenciaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;
}
