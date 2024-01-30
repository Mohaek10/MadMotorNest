import { Test, TestingModule } from '@nestjs/testing'
import { VehiculoMapper } from './vehiculo-mapper'

describe('VehiculoMapper', () => {
  let provider: VehiculoMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiculoMapper],
    }).compile()

    provider = module.get<VehiculoMapper>(VehiculoMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
