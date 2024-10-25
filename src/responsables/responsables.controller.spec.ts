import { Test, TestingModule } from '@nestjs/testing';
import { ResponsablesController } from './responsables.controller';
import { ResponsablesService } from './responsables.service';

describe('ResponsablesController', () => {
  let controller: ResponsablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsablesController],
      providers: [ResponsablesService],
    }).compile();

    controller = module.get<ResponsablesController>(ResponsablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
