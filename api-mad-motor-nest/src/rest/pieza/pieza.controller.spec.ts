import { Test, TestingModule } from '@nestjs/testing'
import { PiezaController } from './pieza.controller'
import { PiezaService } from './pieza.service'

describe('PiezaController', () => {
  let controller: PiezaController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PiezaController],
      providers: [PiezaService],
    }).compile()

    controller = module.get<PiezaController>(PiezaController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
