import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, UploadedFile } from '@nestjs/common';
import { IncidenciasService } from './incidencias.service';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('incidencias')
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  @Get()
  async findAll() {
    try {
      return await this.incidenciasService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  /*   @HttpCode(201) */
  async create(@Body() createIncidenciaDto: CreateIncidenciaDto, @Body('folder') folder: string, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), 
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), 
      ],
    }),
  ) file: Express.Multer.File) {
    if (!folder) {
      throw new BadRequestException('Folder not specified')
    }
    console.log(createIncidenciaDto);
    
    //return 'hola mundo'
    return this.incidenciasService.create(createIncidenciaDto, file, folder);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.incidenciasService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateIncidenciaDto: UpdateIncidenciaDto) {
    try {
      return await this.incidenciasService.update(id, updateIncidenciaDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.incidenciasService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
