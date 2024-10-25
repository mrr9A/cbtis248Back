import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Rol } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Rol])],
  exports: [TypeOrmModule]
})
export class RolesModule {}
