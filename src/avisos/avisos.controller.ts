import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, UploadedFile, Query } from '@nestjs/common';
import { AvisosService } from './avisos.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('avisos')
export class AvisosController {
  constructor(private readonly avisosService: AvisosService) { }

  @Get()
  async findAll() {
    try {
      return await this.avisosService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  /*   @HttpCode(201) */
  create(@Body() createAvisoDto: CreateAvisoDto, @Body('folder') folder: string, @UploadedFile(
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
    console.log(createAvisoDto);

    //return 'hola mundo'
    return this.avisosService.create(createAvisoDto, file, folder);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.avisosService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  /*   @Patch(':id')
    async update(@Param('id') id: number, @Body() updateAvisoDto: UpdateAvisoDto) {
      try {
        return await this.avisosService.update(id, updateAvisoDto);
      } catch (error) {
        throw new HttpException(error.message, error.status || 500);
      }
    } */

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAvisoDto: UpdateAvisoDto,
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string,
  ) {
    return this.avisosService.update(id, updateAvisoDto, file, folder);
  }


  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.avisosService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
