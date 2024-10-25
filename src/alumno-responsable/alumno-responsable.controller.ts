import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlumnoResponsableService } from './alumno-responsable.service';
import { CreateAlumnoResponsableDto } from './dto/create-alumno-responsable.dto';
import { UpdateAlumnoResponsableDto } from './dto/update-alumno-responsable.dto';

@Controller('alumno-responsable')
export class AlumnoResponsableController {
  constructor(private readonly alumnoResponsableService: AlumnoResponsableService) {}

  @Post()
  create(@Body() createAlumnoResponsableDto: CreateAlumnoResponsableDto) {
    return this.alumnoResponsableService.create(createAlumnoResponsableDto);
  }

  @Get()
  findAll() {
    return this.alumnoResponsableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alumnoResponsableService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlumnoResponsableDto: UpdateAlumnoResponsableDto) {
    return this.alumnoResponsableService.update(+id, updateAlumnoResponsableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alumnoResponsableService.remove(+id);
  }
}
