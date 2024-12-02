import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) { }

  @Get()
  async findAll() {
    try {
      return await this.alumnosService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  /*   @HttpCode(201) */
  create(@Body() createAlumnoDto: CreateAlumnoDto, @Body('folder') folder: string, @UploadedFile(
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
    console.log(createAlumnoDto);

    //return 'hola mundo'
    return this.alumnosService.create(createAlumnoDto, file, folder);
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
  @UseInterceptors(FileInterceptor('file'))
  async updateAlumno(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    console.log('ID recibido:', id);
    console.log('Datos del alumno:', updateAlumnoDto);
    console.log('Archivo recibido:', file ? file.originalname : 'No se recibió archivo');

    const folder = 'alumnos';
    return await this.alumnosService.update(id, updateAlumnoDto, file, folder);
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
