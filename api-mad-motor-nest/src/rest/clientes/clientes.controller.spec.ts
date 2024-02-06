import { Test, TestingModule } from '@nestjs/testing'
import { ClientesController } from './clientes.controller'
import { ClientesService } from './clientes.service'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { Cliente } from './entities/cliente.entity'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { BadRequestException } from '@nestjs/common'
import { Paginated } from 'nestjs-paginate'
import { ResponseClienteDto } from './dto/response-cliente.dto'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager'

describe('ClientesController', () => {
  let controller: ClientesController
  let service: ClientesService
  let cache: Cache
  const mockService = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })
  const CacheFalseado = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
    del: jest.fn(() => Promise.resolve()),
  }
  const testEntidad = (): Cliente => {
    const cliente = new Cliente()
    cliente.id = 1
    cliente.nombre = 'test'
    cliente.apellido = 'test'
    cliente.codigoPostal = 12345
    cliente.direccion = 'test'
    cliente.dni = '12345678A'
    return cliente
  }
  const testCreateDto = (): CreateClienteDto => {
    const create = new CreateClienteDto()
    create.nombre = 'test'
    create.apellido = 'test'
    create.direccion = 'test'
    create.codigoPostal = 12345
    create.dni = '12345678A'
    return create
  }
  const testUpdateDto = (): UpdateClienteDto => {
    const create = new UpdateClienteDto()
    create.nombre = 'test'
    create.apellido = 'test'
    create.direccion = 'test'
    create.codigoPostal = 12345
    create.dni = '12345678A'
    return create
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [ClientesController],
      providers: [
        { provide: ClientesService, useFactory: mockService },
        {
          provide: CACHE_MANAGER,
          useValue: CacheFalseado,
        },
      ],
    }).compile()

    controller = module.get<ClientesController>(ClientesController)
    service = module.get<ClientesService>(ClientesService)
    cache = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
  describe('create', () => {
    it('should create', async () => {
      const create = testCreateDto()
      const entity = testEntidad()
      jest.spyOn(service, 'create').mockResolvedValue(entity)
      expect(await controller.create(create)).toEqual(entity)
      expect(service.create).toHaveBeenCalledWith(create)
      expect(service.create).toHaveBeenCalledTimes(1)
    })
    it('shuld throw error', async () => {
      const create = testCreateDto()
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException())
      await expect(controller.create(create)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.create).toHaveBeenCalledWith(create)
      expect(service.create).toHaveBeenCalledTimes(1)
    })
  })
  describe('findAll', () => {
    it('should find all', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'clientes',
      }
      const testClientes = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'clientes?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<ResponseClienteDto>
      jest.spyOn(service, 'findAll').mockResolvedValue(testClientes)
      const result: any = await controller.findAll(paginateOptions)
      jest.spyOn(cache, 'get').mockResolvedValue(Promise.resolve(null))
      jest.spyOn(cache, 'set').mockResolvedValue()
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      expect(result.meta.totalPages).toEqual(1)
      expect(result.links.current).toEqual(
        `clientes?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=nombre:ASC`,
      )
      expect(service.findAll).toHaveBeenCalled()
    })
  })
  describe('findOne', () => {
    it('should find one', async () => {
      const entity = new ResponseClienteDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(entity)
      expect(await controller.findOne(1)).toEqual(entity)
      expect(service.findOne).toHaveBeenCalledWith(1)
      expect(service.findOne).toHaveBeenCalledTimes(1)
    })
    it('should throw error', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new BadRequestException())
      await expect(controller.findOne(8989)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.findOne).toHaveBeenCalledTimes(1)
    })
  })
  describe('update', () => {
    it('should update', async () => {
      const update = testUpdateDto()
      const entity = testEntidad()
      jest.spyOn(service, 'update').mockResolvedValue(entity)
      jest.spyOn(cache, 'del').mockResolvedValue()
      expect(await controller.update(1, update)).toEqual(entity)
      expect(service.update).toHaveBeenCalledWith(1, update)
      expect(service.update).toHaveBeenCalledTimes(1)
    })
    it('should throw error', async () => {
      const update = testUpdateDto()
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())
      jest.spyOn(cache, 'get').mockResolvedValue(null)
      await expect(controller.update(8989, update)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.update).toHaveBeenCalledTimes(1)
    })
  })
  describe('remove', () => {
    it('should remove', async () => {
      const entity = testEntidad()
      jest.spyOn(service, 'remove').mockResolvedValue(entity)
      jest.spyOn(cache, 'del').mockResolvedValue()
      expect(await controller.remove(1)).toEqual(entity)
      expect(service.remove).toHaveBeenCalledWith(1)
      expect(service.remove).toHaveBeenCalledTimes(1)
    })
    it('should throw error', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new BadRequestException())
      jest.spyOn(cache, 'get').mockResolvedValue(null)
      await expect(controller.remove(8989)).rejects.toThrow(BadRequestException)
      expect(service.remove).toHaveBeenCalledTimes(1)
    })
  })
})
