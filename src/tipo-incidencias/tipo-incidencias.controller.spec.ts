import { Test, TestingModule } from '@nestjs/testing';
import { TipoIncidenciasController } from './tipo-incidencias.controller';
import { TipoIncidenciasService } from './tipo-incidencias.service';

describe('TipoIncidenciasController', () => {
  let controller: TipoIncidenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoIncidenciasController],
      providers: [TipoIncidenciasService],
    }).compile();

    controller = module.get<TipoIncidenciasController>(TipoIncidenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
