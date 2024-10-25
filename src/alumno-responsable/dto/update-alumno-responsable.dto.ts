import { PartialType } from '@nestjs/mapped-types';
import { CreateAlumnoResponsableDto } from './create-alumno-responsable.dto';

export class UpdateAlumnoResponsableDto extends PartialType(CreateAlumnoResponsableDto) {}
