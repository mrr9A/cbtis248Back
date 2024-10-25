import { Test, TestingModule } from '@nestjs/testing';
import { TipoIncidenciasService } from './tipo-incidencias.service';

describe('TipoIncidenciasService', () => {
  let service: TipoIncidenciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoIncidenciasService],
    }).compile();

    service = module.get<TipoIncidenciasService>(TipoIncidenciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
