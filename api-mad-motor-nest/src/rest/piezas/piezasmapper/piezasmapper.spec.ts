import { Test, TestingModule } from '@nestjs/testing';
import { Piezasmapper } from './piezasmapper';

describe('Piezasmapper', () => {
  let provider: Piezasmapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Piezasmapper],
    }).compile();

    provider = module.get<Piezasmapper>(Piezasmapper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
