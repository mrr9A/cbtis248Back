import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { Grupo } from './entities/grupo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GruposController],
  providers: [GruposService],
  imports: [TypeOrmModule.forFeature([Grupo])],
  exports: [TypeOrmModule]
})
export class GruposModule {}
