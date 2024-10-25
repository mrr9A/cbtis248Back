import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException } from '@nestjs/common';
import { AdministrativosService } from './administrativos.service';
import { CreateAdministrativoDto } from './dto/create-administrativo.dto';
import { UpdateAdministrativoDto } from './dto/update-administrativo.dto';

@Controller('administrativos')
export class AdministrativosController {
  constructor(private readonly administrativosService: AdministrativosService) {}

  @Get()
  async findAll() {
    try {
      return await this.administrativosService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  async create(@Body() createAdministrativoDto: CreateAdministrativoDto) {
    try {
      return await this.administrativosService.create(createAdministrativoDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.administrativosService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAdministrativoDto: UpdateAdministrativoDto) {
    try {
      return await this.administrativosService.update(id, updateAdministrativoDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.administrativosService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
