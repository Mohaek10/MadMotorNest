import { Test, TestingModule } from '@nestjs/testing'
import { PiezaMapper } from './pieza-mapper'

describe('PiezaMapper', () => {
  let provider: PiezaMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiezaMapper],
    }).compile()

    provider = module.get<PiezaMapper>(PiezaMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
