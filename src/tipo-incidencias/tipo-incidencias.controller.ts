import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException } from '@nestjs/common';
import { TipoIncidenciasService } from './tipo-incidencias.service';
import { CreateTipoIncidenciaDto } from './dto/create-tipo-incidencia.dto';
import { UpdateTipoIncidenciaDto } from './dto/update-tipo-incidencia.dto';

@Controller('tipo-incidencias')
export class TipoIncidenciasController {
  constructor(private readonly tipoIncidenciasService: TipoIncidenciasService) {}

  @Get()
  async findAll() {
    try {
      return await this.tipoIncidenciasService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  async create(@Body() createTipoIncidenciaDto: CreateTipoIncidenciaDto) {
    try {
      return await this.tipoIncidenciasService.create(createTipoIncidenciaDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.tipoIncidenciasService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateTipoIncidenciaDto: UpdateTipoIncidenciaDto) {
    try {
      return await this.tipoIncidenciasService.update(id, updateTipoIncidenciaDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.tipoIncidenciasService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
