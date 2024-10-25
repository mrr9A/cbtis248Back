import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Get()
  async findAll() {
    try {
      return await this.alumnosService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  async create(@Body() createAlumnoDto: CreateAlumnoDto) {
    try {
      return await this.alumnosService.create(createAlumnoDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.alumnosService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    try {
      return await this.alumnosService.update(id, updateAlumnoDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.alumnosService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
