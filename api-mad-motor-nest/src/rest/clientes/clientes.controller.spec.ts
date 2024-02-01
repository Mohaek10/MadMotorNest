import { Test, TestingModule } from '@nestjs/testing'
import { ClientesController } from './clientes.controller'
import { ClientesService } from './clientes.service'
import { CacheModule } from '@nestjs/cache-manager'

describe('ClientesController', () => {
  let controller: ClientesController
  let service: ClientesService
  const mockService = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [ClientesController],
      providers: [{ provide: ClientesService, useFactory: mockService }],
    }).compile()

    controller = module.get<ClientesController>(ClientesController)
    service = module.get<ClientesService>(ClientesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
