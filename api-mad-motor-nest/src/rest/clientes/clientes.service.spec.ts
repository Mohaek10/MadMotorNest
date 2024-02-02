import { Test, TestingModule } from '@nestjs/testing'
import { ClientesService } from './clientes.service'
import { createQueryBuilder, Repository } from 'typeorm'
import { Cliente } from './entities/cliente.entity'
import { ClientesMapper } from './mapper/clientes.mapper'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { getRepositoryToken } from '@nestjs/typeorm'
import spyOn = jest.spyOn
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { ResponseClienteDto } from './dto/response-cliente.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Paginated } from 'nestjs-paginate'
import { skip, take } from 'rxjs'

describe('ClientesService', () => {
  let service: ClientesService
  let repository: Repository<Cliente>
  let mapper: ClientesMapper
  let cacheManager: Cache
  let repoTestForFindAll: Repository<Cliente>

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  })
  const mockMapper = () => ({
    toCliente: jest.fn(),
    toClienteUpdate: jest.fn(),
    toClienteResponse: jest.fn(),
  })
  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }
  const clienteTest = (): Cliente => {
    const testCliente = new Cliente()
    testCliente.id = 1
    testCliente.nombre = 'test'
    testCliente.apellido = 'test'
    testCliente.direccion = 'test'
    testCliente.codigoPostal = 12345
    testCliente.dni = '12345678A'
    return testCliente
  }
  const clienteTestCreate = (): CreateClienteDto => {
    const testCliente = new CreateClienteDto()
    testCliente.nombre = 'test'
    testCliente.apellido = 'test'
    testCliente.direccion = 'test'
    testCliente.codigoPostal = 12345
    testCliente.dni = '12345678A'
    return testCliente
  }
  const clienteTestUpdate = (): UpdateClienteDto => {
    const testCliente = new UpdateClienteDto()
    testCliente.nombre = 'change'
    testCliente.apellido = 'test'
    testCliente.direccion = 'test'
    testCliente.codigoPostal = 12345
    return testCliente
  }
  const clienteTestResponse = (): ResponseClienteDto => {
    const testCliente = new ResponseClienteDto()
    testCliente.id = 1
    testCliente.nombre = 'test'
    testCliente.apellido = 'test'
    testCliente.direccion = 'test'
    testCliente.codigoPostal = 12345
    testCliente.dni = '12345678A'
    return testCliente
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: getRepositoryToken(Cliente),
          useFactory: mockRepository,
        },
        {
          provide: ClientesMapper,
          useFactory: mockMapper,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
        {
          provide: getRepositoryToken(Cliente),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<ClientesService>(ClientesService)
    repository = module.get<Repository<Cliente>>(getRepositoryToken(Cliente))
    repoTestForFindAll = module.get<Repository<Cliente>>(
      getRepositoryToken(Cliente),
    )
    mapper = module.get<ClientesMapper>(ClientesMapper)
    cacheManager = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('create', () => {
    it('should create a new cliente', async () => {
      const testClienteCreate = clienteTestCreate()
      const testResponseCliente = clienteTestResponse()
      const testCliente = clienteTest()
      spyOn(repository, 'findOne').mockResolvedValue(undefined)
      spyOn(mapper, 'toCliente').mockReturnValue(testCliente)
      spyOn(repository, 'save').mockResolvedValue(testCliente)
      spyOn(mapper, 'toClienteResponse').mockReturnValue(testResponseCliente)
      expect(await service.create(testClienteCreate)).toEqual(
        testResponseCliente,
      )
    })
    it('should throw an error if the cliente already exists with the same dni', async () => {
      const testClienteCreate = clienteTestCreate()
      testClienteCreate.dni = '12345678A'
      const testCliente = clienteTest()
      testCliente.dni = '12345678A'
      spyOn(repository, 'findOne').mockResolvedValue(testCliente)
      await expect(service.create(testClienteCreate)).rejects.toThrowError(
        BadRequestException,
      )
    })
  })
  describe('findOne', () => {
    it('should return a cliente', async () => {
      const testCliente = clienteTest()
      const testResponseCliente = clienteTestResponse()
      spyOn(repository, 'findOne').mockResolvedValue(testCliente)
      spyOn(mapper, 'toClienteResponse').mockReturnValue(testResponseCliente)
      expect(await service.findOne(1)).toEqual(testResponseCliente)
    })
    it('should throw an error if the cliente does not exist', async () => {
      spyOn(repository, 'findOne').mockResolvedValue(undefined)
      await expect(service.findOne(889898)).rejects.toThrowError(
        NotFoundException,
      )
    })
  })
  describe('Update', () => {
    it('should update a cliente', async () => {
      const testCliente = clienteTest()
      const testClienteUpdate = clienteTestUpdate()
      const testResponseCliente = clienteTestResponse()
      spyOn(repository, 'findOne').mockResolvedValue(testCliente)
      spyOn(mapper, 'toClienteUpdate').mockReturnValue(testCliente)
      spyOn(repository, 'save').mockResolvedValue(testCliente)
      spyOn(mapper, 'toClienteResponse').mockReturnValue(testResponseCliente)
      expect(await service.update(1, testClienteUpdate)).toEqual(
        testResponseCliente,
      )
      expect(mapper.toCliente).toBeCalledTimes(0)
      expect(repository.save).toBeCalledTimes(1)
      expect(mapper.toClienteResponse).toBeCalledTimes(1)
    })
    it('should throw an error if the cliente does not exist', async () => {
      const testClienteUpdate = clienteTestUpdate()
      spyOn(repository, 'findOne').mockResolvedValue(undefined)
      await expect(
        service.update(89898, testClienteUpdate),
      ).rejects.toThrowError(NotFoundException)
    })
  })
  describe('remove', () => {
    it('should remove a cliente', async () => {
      const testCliente = clienteTest()
      const testResponseCliente = clienteTestResponse()
      spyOn(repository, 'findOne').mockResolvedValue(testCliente)
      spyOn(repository, 'remove').mockResolvedValue(testCliente)
      spyOn(mapper, 'toClienteResponse').mockReturnValue(testResponseCliente)
      expect(await service.remove(1)).toEqual(testResponseCliente)
    })
    it('should throw an error if the cliente does not exist', async () => {
      spyOn(repository, 'findOne').mockResolvedValue(undefined)
      await expect(service.remove(89898)).rejects.toThrowError(
        NotFoundException,
      )
    })
  })
  describe('findAll', () => {
    it('should return a list of clientes', async () => {
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
          current: 'clientes?page=1&limit=10&sortBy=nombre:DESC',
        },
      } as Paginated<Cliente>

      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([testClientes, 1]),
      }
      jest
        .spyOn(repoTestForFindAll, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      const result: any = await service.findAll(paginateOptions)
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      expect(result.meta.totalPages).toEqual(1)
      expect(result.links.current).toEqual(
        `clientes?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=nombre:DESC`,
      )
    })
  })
})
