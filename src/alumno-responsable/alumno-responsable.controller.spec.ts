import { Test, TestingModule } from '@nestjs/testing';
import { AlumnoResponsableController } from './alumno-responsable.controller';
import { AlumnoResponsableService } from './alumno-responsable.service';

describe('AlumnoResponsableController', () => {
  let controller: AlumnoResponsableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlumnoResponsableController],
      providers: [AlumnoResponsableService],
    }).compile();

    controller = module.get<AlumnoResponsableController>(AlumnoResponsableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
