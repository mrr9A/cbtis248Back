import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, HttpCode } from '@nestjs/common';
import { ResponsablesService } from './responsables.service';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import { UpdateResponsableDto } from './dto/update-responsable.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('responsables')
export class ResponsablesController {
  constructor(private readonly responsablesService: ResponsablesService) { }

  @Get()
  async findAll() {
    try {
      return await this.responsablesService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
/*   @HttpCode(201) */
  create(@Body() createResponsableDto: CreateResponsableDto, @Body('folder') folder: string, @UploadedFile(
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
    console.log(createResponsableDto);
    
    //return 'hola mundo'
    return this.responsablesService.create(createResponsableDto, file, folder);
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
