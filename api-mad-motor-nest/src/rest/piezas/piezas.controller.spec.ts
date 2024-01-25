import { Test, TestingModule } from '@nestjs/testing';
import { PiezasController } from './piezas.controller';
import { PiezasService } from './piezas.service';

describe('PiezasController', () => {
  let controller: PiezasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PiezasController],
      providers: [PiezasService],
    }).compile();

    controller = module.get<PiezasController>(PiezasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
