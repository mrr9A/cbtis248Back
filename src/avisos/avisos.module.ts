import { Module } from '@nestjs/common';
import { AvisosService } from './avisos.service';
import { AvisosController } from './avisos.controller';
import { Aviso } from './entities/aviso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AvisosController],
  providers: [AvisosService],
  imports: [TypeOrmModule.forFeature([Aviso])],
})
export class AvisosModule {}
