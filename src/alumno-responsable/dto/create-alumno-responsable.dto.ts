import { IsInt, IsNotEmpty } from "class-validator";

export class CreateAlumnoResponsableDto {
    @IsInt()
    @IsNotEmpty()
    alumnoId: number;
  
    @IsInt()
    @IsNotEmpty()
    responsableId: number;
}
