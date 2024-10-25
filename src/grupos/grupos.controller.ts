import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Post()
  async create(@Body() createGrupoDto: CreateGrupoDto) {
    try {
      return await this.gruposService.create(createGrupoDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.gruposService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.gruposService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
    try {
      return await this.gruposService.update(+id, updateGrupoDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.gruposService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
