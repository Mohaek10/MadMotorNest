import { Test, TestingModule } from '@nestjs/testing'
import { VehiculosService } from './vehiculos.service'
import { VehiculoMapper } from './mappers/vehiculo-mapper'
import { Repository } from 'typeorm'
import { Vehiculo } from './entities/vehiculo.entity'
import { Categoria } from '../categorias/entities/categoria.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { StorageService } from '../storage/storage.service'
import { NotificationGateway } from '../../notification/notification.gateway'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateVehiculoDto } from './dto/create-vehiculo.dto'
import { ResponseVehiculoDto } from './dto/response-vehiculo.dto'
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Paginated } from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'

describe('VehiculosService', () => {
  let service: VehiculosService
  let mapper: VehiculoMapper
  let vehiculoRepository: Repository<Vehiculo>
  let categoriaRepository: Repository<Categoria>
  let cacheManager: Cache
  let storageService: StorageService
  let notificacionService: NotificationGateway

  const mockMapper = {
    toVehiculo: jest.fn(),
    toVehiculoFromUpdate: jest.fn(),
    toResponseVehiculoDto: jest.fn(),
  }
  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    del: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
      del: jest.fn(),
    },
  }
  const mockStorageService = {
    obtenerTodasLasImagenesConUrls: jest.fn(),
    encontrarFichero: jest.fn(),
    borraFichero: jest.fn(),
  }
  const notificacionServiceMock = {
    sendMessage: jest.fn(),
  }
  const categoriaEntity = (): Categoria => {
    const categoria = new Categoria()
    categoria.id = '1'
    categoria.nombre = 'Sedan'
    categoria.createdAt = new Date()
    categoria.updatedAt = new Date()
    categoria.isDeleted = false
    return categoria
  }
  const vehiculoEntity = (): Vehiculo => {
    const vehiculo = new Vehiculo()
    vehiculo.id = 1
    vehiculo.marca = 'Toyota'
    vehiculo.modelo = 'Corolla'
    vehiculo.year = 2021
    vehiculo.km = 1000
    vehiculo.precio = 20000
    vehiculo.stock = 10
    vehiculo.image = 'https://picsum.photos/200'
    vehiculo.createdAt = new Date()
    vehiculo.updateAt = new Date()
    vehiculo.isDeleted = false
    vehiculo.categoria = categoriaEntity()
    return vehiculo
  }
  const vehiculoCreateDto = (): CreateVehiculoDto => {
    const vehiculo = new CreateVehiculoDto()
    vehiculo.marca = 'Toyota'
    vehiculo.modelo = 'Corolla'
    vehiculo.year = 2021
    vehiculo.km = 1000
    vehiculo.precio = 20000
    vehiculo.stock = 10
    vehiculo.image = 'https://picsum.photos/200'
    vehiculo.categoria = 'Sedan'
    return vehiculo
  }
  const vehiculoResponseDto = (): ResponseVehiculoDto => {
    const vehiculo = new ResponseVehiculoDto()
    vehiculo.id = 1
    vehiculo.marca = 'Toyota'
    vehiculo.modelo = 'Corolla'
    vehiculo.year = 2021
    vehiculo.km = 1000
    vehiculo.precio = 20000
    vehiculo.stock = 10
    vehiculo.image = 'https://picsum.photos/200'
    vehiculo.createdAt = new Date()
    vehiculo.updateAt = new Date()
    vehiculo.isDeleted = false
    vehiculo.categoria = 'Sedan'
    return vehiculo
  }
  const vehiculoUpdateDto = (): UpdateVehiculoDto => {
    const vehiculo = new UpdateVehiculoDto()
    vehiculo.marca = 'Change'
    vehiculo.modelo = 'Change'
    return vehiculo
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculosService,
        {
          provide: getRepositoryToken(Vehiculo),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Categoria),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
        {
          provide: VehiculoMapper,
          useValue: mockMapper,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: NotificationGateway,
          useValue: notificacionServiceMock,
        },
      ],
    }).compile()

    service = module.get<VehiculosService>(VehiculosService)
    mapper = module.get<VehiculoMapper>(VehiculoMapper)
    vehiculoRepository = module.get<Repository<Vehiculo>>(
      getRepositoryToken(Vehiculo),
    )
    categoriaRepository = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    )
    cacheManager = module.get<Cache>(CACHE_MANAGER)
    storageService = module.get<StorageService>(StorageService)
    notificacionService = module.get<NotificationGateway>(NotificationGateway)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('findOne', () => {
    it('should return a vehiculo', async () => {
      const responseDto = vehiculoResponseDto()
      const vehiculo = vehiculoEntity()
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)
      jest.spyOn(vehiculoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(vehiculo),
      } as any)
      jest.spyOn(mapper, 'toResponseVehiculoDto').mockReturnValue(responseDto)
      jest.spyOn(cacheManager, 'set').mockResolvedValue(null)
      expect(await service.findOne(1)).toEqual(responseDto)
      expect(cacheManager.get).toBeCalledTimes(1)
      expect(vehiculoRepository.createQueryBuilder).toBeCalledTimes(1)
      expect(mapper.toResponseVehiculoDto).toBeCalledTimes(1)
      expect(cacheManager.set).toBeCalledTimes(1)
    })
    it('should return a vehiculo from cache', async () => {
      const responseDto = vehiculoResponseDto()
      jest.spyOn(cacheManager, 'get').mockResolvedValue(responseDto)
      expect(await service.findOne(1)).toEqual(responseDto)
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)
      jest.spyOn(vehiculoRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any)
      await expect(service.findOne(9898)).rejects.toThrowError(
        NotFoundException,
      )
    })
  })
  describe('create', () => {
    it('should create a vehiculo', async () => {
      const vehiculo = vehiculoEntity()
      const createDto = vehiculoCreateDto()
      const responseDto = vehiculoResponseDto()
      const categoria = categoriaEntity()
      jest.spyOn(mapper, 'toVehiculo').mockReturnValue(vehiculo)
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(categoria),
      }
      jest
        .spyOn(categoriaRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(vehiculo)
      jest.spyOn(mapper, 'toResponseVehiculoDto').mockReturnValue(responseDto)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      expect(await service.create(createDto)).toEqual(responseDto)
      expect(vehiculoRepository.save).toBeCalledTimes(1)
      expect(mapper.toVehiculo).toBeCalledTimes(1)
    })
    it('should throw an error if the category does not exist', async () => {
      const createDto = vehiculoCreateDto()
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(categoriaRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(null)
      await expect(service.create(createDto)).rejects.toThrowError(
        BadRequestException,
      )
      expect(vehiculoRepository.save).toBeCalledTimes(0)
    })
  })
  describe('update', () => {
    it('should update a vehiculo', async () => {
      const vehiculo = vehiculoEntity()
      const updateDto = vehiculoUpdateDto()
      const responseDto = vehiculoResponseDto()
      jest.spyOn(mapper, 'toVehiculoFromUpdate').mockReturnValue(vehiculo)
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(vehiculo)
      jest.spyOn(mapper, 'toResponseVehiculoDto').mockReturnValue(responseDto)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      expect(await service.update(1, updateDto)).toEqual(responseDto)
      expect(vehiculoRepository.save).toBeCalledTimes(1)
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      const updateDto = vehiculoUpdateDto()
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(undefined)
      await expect(service.update(9898, updateDto)).rejects.toThrowError(
        NotFoundException,
      )
      expect(vehiculoRepository.save).toBeCalledTimes(0)
    })
    it('should throw an error if the category does not exist', async () => {
      const updateDto = vehiculoUpdateDto()
      updateDto.categoria = ' '
      const vehiculo = vehiculoEntity()
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(categoriaRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(null)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      await expect(service.update(1, updateDto)).rejects.toThrowError(
        BadRequestException,
      )
    })
  })
  describe('remove', () => {
    it('should remove a vehiculo', async () => {
      const vehiculo = vehiculoEntity()
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      jest.spyOn(vehiculoRepository, 'remove').mockResolvedValue(vehiculo)
      expect(await service.remove(1)).toEqual(vehiculo)
      expect(vehiculoRepository.remove).toBeCalledTimes(1)
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(vehiculoRepository, 'remove').mockResolvedValue(undefined)
      await expect(service.remove(9898)).rejects.toThrowError(NotFoundException)
      expect(vehiculoRepository.remove).toBeCalledTimes(0)
    })
  })
  describe('borradoLogico', () => {
    it('should remove a vehiculo', async () => {
      const vehiculo = vehiculoEntity()
      vehiculo.isDeleted = true
      const responseDto = vehiculoResponseDto()
      responseDto.isDeleted = true
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(vehiculo)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      jest.spyOn(mapper, 'toResponseVehiculoDto').mockReturnValue(responseDto)
      expect(await service.borradoLogico(1)).toEqual(responseDto)
      expect(vehiculoRepository.save).toBeCalledTimes(1)
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(undefined)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      await expect(service.borradoLogico(9898)).rejects.toThrowError(
        NotFoundException,
      )
      expect(vehiculoRepository.save).toBeCalledTimes(0)
    })
  })
  describe('actualizarImagenVehiculo', () => {
    it('should update the image of a vehiculo', async () => {
      const mockFile = {
        filename: 'new_image',
      }
      const mockRequest = {
        protocol: 'http',
        get: () => 'localhost',
      }
      const vehiculoResponse = vehiculoResponseDto()
      const vehiculo = vehiculoEntity()
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      jest.spyOn(storageService, 'borraFichero')
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(vehiculo)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      jest
        .spyOn(mapper, 'toResponseVehiculoDto')
        .mockReturnValue(vehiculoResponse)
      expect(
        await service.actualizarImagenVehiculo(
          1,
          mockFile as any,
          mockRequest as any,
          true,
        ),
      ).toEqual(vehiculoResponse)
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      const mockFile = {
        filename: 'new_image',
      }
      const mockRequest = {
        protocol: 'http',
        get: () => 'localhost',
      }
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(null)
      jest.spyOn(storageService, 'borraFichero')
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(undefined)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      await expect(
        service.actualizarImagenVehiculo(
          9898,
          mockFile as any,
          mockRequest as any,
          true,
        ),
      ).rejects.toThrowError(BadRequestException)
    })
    it('should throw an error if the file does not exist', async () => {
      const mockRequest = {
        protocol: 'http',
        get: () => 'localhost',
      }
      const vehiculo = vehiculoEntity()
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      await expect(
        service.actualizarImagenVehiculo(1, null, mockRequest as any, true),
      ).rejects.toThrowError(BadRequestException)
    })
    it('should throw an error if the file can not be removed', async () => {
      const mockRequest = {
        protocol: 'http',
        get: () => 'localhost',
      }
      const vehiculo = vehiculoEntity()
      vehiculo.image = 'new_image'
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      jest.spyOn(storageService, 'borraFichero').mockImplementationOnce(() => {
        TypeError
      })
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(vehiculo)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      await expect(
        service.actualizarImagenVehiculo(1, null, mockRequest as any, true),
      ).rejects.toThrowError(BadRequestException)
    })
    it('should update the image of a vehiculo with false', async () => {
      const mockFile = {
        filename: 'new_image',
      }
      const mockRequest = {
        protocol: 'http',
        get: () => 'localhost',
      }
      const vehiculoResponse = vehiculoResponseDto()
      const vehiculo = vehiculoEntity()
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      jest.spyOn(storageService, 'borraFichero')
      jest.spyOn(vehiculoRepository, 'save').mockResolvedValue(vehiculo)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      jest
        .spyOn(mapper, 'toResponseVehiculoDto')
        .mockReturnValue(vehiculoResponse)
      expect(
        await service.actualizarImagenVehiculo(
          1,
          mockFile as any,
          mockRequest as any,
          false,
        ),
      ).toEqual(vehiculoResponse)
    })
  })
  describe('findAll', () => {
    it('should return an array of vehiculos', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'vehiculos',
      }
      const testVehiculoss = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'vehiculos?page=1&limit=10&sortBy=marca:ASC',
        },
      } as Paginated<ResponseVehiculoDto>

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([]),
      }
      jest
        .spyOn(vehiculoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)
      jest.spyOn(cacheManager, 'set').mockResolvedValue(null)
      const result: any = await service.findAll(paginateOptions)
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      expect(result.links.current).toEqual(
        `vehiculos?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=marca:ASC`,
      )
    })
    it('should return an array of vehiculos from cache', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'vehiculos',
      }
      const testVehiculos = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'vehiculos?page=1&limit=10&sortBy=marca:ASC',
        },
      } as Paginated<ResponseVehiculoDto>
      jest.spyOn(cacheManager, 'get').mockResolvedValue(testVehiculos)
      const result: any = await service.findAll(paginateOptions)
      expect(cacheManager.get).toHaveBeenCalledWith(
        `vehiculos_${hash(JSON.stringify(paginateOptions))}`,
      )
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      expect(result.meta.totalPages).toEqual(1)
      expect(result.links.current).toEqual(
        `vehiculos?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=marca:ASC`,
      )
      expect(result).toEqual(testVehiculos)
    })
  })
  describe('comprobarCategoria', () => {
    it('should return a category', async () => {
      const categoria = categoriaEntity()
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(categoria),
      }
      jest
        .spyOn(categoriaRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      expect(await service.comprobarCategoriaTest('Sedan')).toEqual(categoria)
    })
    it('should return null', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(categoriaRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      await expect(
        service.comprobarCategoriaTest('Sedan'),
      ).rejects.toThrowError(BadRequestException)
    })
  })
  describe('invalidateCacheKey', () => {
    it('should invalidate cache keys matching the specified pattern', async () => {
      const keyPattern = 'example_key'
      const cacheKeys = ['example_key_1', 'example_key_2', 'other_key_1']

      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue(cacheKeys)
      jest.spyOn(cacheManager, 'del').mockResolvedValue()
      await service.invalidateCacheKey(keyPattern)
      expect(cacheManager.store.keys).toHaveBeenCalledWith()
      expect(cacheManager.del).toHaveBeenCalledWith('example_key_1')
      expect(cacheManager.del).toHaveBeenCalledWith('example_key_2')
      expect(cacheManager.del).not.toHaveBeenCalledWith('other_key_1')
    })
  })
  describe('vehiculoExists', () => {
    it('should return a vehiculo', async () => {
      const vehiculo = vehiculoEntity()
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(vehiculo)
      expect(await service.vehiculoExists(1)).toEqual(vehiculo)
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      jest.spyOn(vehiculoRepository, 'findOneBy').mockResolvedValue(null)
      await expect(service.vehiculoExists(9898)).rejects.toThrowError(
        NotFoundException,
      )
    })
  })
})
