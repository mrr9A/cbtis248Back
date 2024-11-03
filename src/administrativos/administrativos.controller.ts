import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, UseInterceptors, BadRequestException, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe, UploadedFile } from '@nestjs/common';
import { AdministrativosService } from './administrativos.service';
import { CreateAdministrativoDto } from './dto/create-administrativo.dto';
import { UpdateAdministrativoDto } from './dto/update-administrativo.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('file'))
/*   @HttpCode(201) */
  create(@Body() createAdministrativoDto: CreateAdministrativoDto, @Body('folder') folder: string, @UploadedFile(
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
    console.log(createAdministrativoDto);
    
    //return 'hola mundo'
    return this.administrativosService.create(createAdministrativoDto, file, folder);
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
