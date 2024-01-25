import { Test, TestingModule } from '@nestjs/testing';
import { PiezasService } from './piezas.service';

describe('PiezasService', () => {
  let service: PiezasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiezasService],
    }).compile();

    service = module.get<PiezasService>(PiezasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
