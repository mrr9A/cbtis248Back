import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException } from '@nestjs/common';
import { ResponsablesService } from './responsables.service';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import { UpdateResponsableDto } from './dto/update-responsable.dto';

@Controller('responsables')
export class ResponsablesController {
  constructor(private readonly responsablesService: ResponsablesService) {}

  @Get()
  async findAll() {
    try {
      return await this.responsablesService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  async create(@Body() createResponsableDto: CreateResponsableDto) {
    try {
      return await this.responsablesService.create(createResponsableDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.responsablesService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateResponsableDto: UpdateResponsableDto) {
    try {
      return await this.responsablesService.update(id, updateResponsableDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.responsablesService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
