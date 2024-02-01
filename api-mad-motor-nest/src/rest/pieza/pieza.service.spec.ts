import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Repository } from 'typeorm'
import { Cache } from 'cache-manager'
import { NotFoundException } from '@nestjs/common'
import { PiezaService } from './pieza.service'
import { CreatePiezaDto } from './dto/create-pieza.dto'
import { UpdatePiezaDto } from './dto/update-pieza.dto'
import { Pieza } from './entities/pieza.entity'
import { PiezaMapper } from './mappers/pieza-mapper'
import { PaginateQuery } from 'nestjs-paginate'

describe('PiezaService', () => {
  let service: PiezaService
  let piezaRepository: Repository<Pieza>
  let cacheManager: Cache
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        PiezaService,
        PiezaMapper,
        {
          provide: getRepositoryToken(Pieza),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<PiezaService>(PiezaService)
    piezaRepository = module.get<Repository<Pieza>>(getRepositoryToken(Pieza))
    cacheManager = module.get<Cache>(CACHE_MANAGER)
  })

  describe('findAll', () => {
    it('should return paginated piezas', async () => {
      const query: PaginateQuery = { page: 1, limit: 10, path: '/pieza' }
      const expectedResult = {
        data: [
          {
            id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
            nombre: 'test',
            precio: 2,
            descripcion: 'test',
            cantidad: 3,
            image: 'test',
          },
        ],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: {
          first: '/pieza?page=1&limit=10',
          previous: '',
          next: '',
          last: '/pieza?page=1&limit=10',
        },
      }

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)

      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce(expectedResult.data),
      } as any)

      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined)

      const result = await service.findAll(query)

      expect(result).toEqual(expectedResult)
      expect(cacheManager.get).toHaveBeenCalledWith(expect.any(String))
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expectedResult,
        expect.any(Number),
      )
    })

    it('should return paginated piezas from cache if available', async () => {
      const query: PaginateQuery = { page: 1, limit: 10, path: '/pieza' }
      const cachedResult = {
        data: [
          {
            id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
            nombre: 'test',
            precio: 2,
            cantidad: 3,
            descripcion: 'test',
            image: 'test',
          },
        ],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: {
          first: '/pieza?page=1&limit=10',
          previous: '',
          next: '',
          last: '/pieza?page=1&limit=10',
        },
      }

      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedResult)

      const result = await service.findAll(query)

      expect(result).toEqual(cachedResult)
      expect(cacheManager.get).toHaveBeenCalledWith(expect.any(String))
      expect(cacheManager.set).not.toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a pieza by id', async () => {
      const pieza = {
        id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
        nombre: 'test',
        precio: 2,
        cantidad: 3,
        descripcion: 'test',
        image: 'test',
      }

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)

      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(pieza),
      } as any)

      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce(undefined)

      const result = await service.findOne(pieza.id)

      expect(result).toEqual(pieza)
      expect(cacheManager.get).toHaveBeenCalledWith(expect.any(String))
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        pieza,
        expect.any(Number),
      )
    })

    it('should return a pieza from cache if available', async () => {
      const cachedPieza = {
        id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
        nombre: 'test',
        precio: 2,
        cantidad: 3,
        descripcion: 'test',
        image: 'test',
      }

      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedPieza)

      const result = await service.findOne(cachedPieza.id)

      expect(result).toEqual(cachedPieza)
      expect(cacheManager.get).toHaveBeenCalledWith(expect.any(String))
      expect(cacheManager.set).not.toHaveBeenCalled()
    })

    it('should throw NotFoundException if pieza not found', async () => {
      const id = '7fe81546-bec9-4356-a4f3-4913e1e8db80'

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)

      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as any)

      await expect(service.findOne(id)).rejects.toThrowError(NotFoundException)
      expect(cacheManager.get).toHaveBeenCalledWith(expect.any(String))
      expect(cacheManager.set).not.toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('should create a pieza', async () => {
      const createPiezaDto: CreatePiezaDto = {
        nombre: 'test',
        precio: 2,
        cantidad: 3,
        descripcion: 'test',
        image: 'test',
      }

      const piezaToCreate = {
        id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
        ...createPiezaDto,
      }

      const piezaCreated = {
        id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
        ...createPiezaDto,
      }

      jest
        .spyOn(piezaRepository, 'save')
        .mockResolvedValueOnce(piezaToCreate as any)

      jest.spyOn(service, 'invalidateCacheKey').mockResolvedValueOnce(undefined)

      const result = await service.create(createPiezaDto)

      expect(result).toEqual(piezaCreated)
      expect(piezaRepository.save).toHaveBeenCalledWith(expect.any(Pieza))
      expect(service.invalidateCacheKey).toHaveBeenCalledWith('all_piezas')
    })
  })

  describe('update', () => {
    it('should update a pieza by id', async () => {
      const id = '7fe81546-bec9-4356-a4f3-4913e1e8db80'
      const updatePiezaDto: UpdatePiezaDto = {
        nombre: 'updatedTest',
      }

      const piezaToUpdate = {
        id,
        nombre: 'test',
        description: 'test',
        image: 'test',
      }

      const updatedPieza = {
        id,
        ...piezaToUpdate,
        ...updatePiezaDto,
      }

      jest.spyOn(service, 'exists').mockResolvedValueOnce(piezaToUpdate as any)

      jest
        .spyOn(piezaRepository, 'save')
        .mockResolvedValueOnce(updatedPieza as any)

      jest.spyOn(service, 'invalidateCacheKey').mockResolvedValueOnce(undefined)

      const result = await service.update(id, updatePiezaDto)

      expect(result).toEqual(updatedPieza)
      expect(piezaRepository.save).toHaveBeenCalledWith(updatedPieza)
      expect(service.invalidateCacheKey).toHaveBeenCalledWith(`pieza_${id}`)
      expect(service.invalidateCacheKey).toHaveBeenCalledWith('all_piezas')
    })

    it('should throw NotFoundException if pieza not found', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('remove', () => {
    it('should remove a pieza by id', async () => {
      const id = '7fe81546-bec9-4356-a4f3-4913e1e8db80'
      const piezaToRemove = {
        id,
        nombre: 'test',
        description: 'test',
        image: 'test',
      }

      jest.spyOn(service, 'exists').mockResolvedValueOnce(piezaToRemove as any)

      jest
        .spyOn(piezaRepository, 'remove')
        .mockResolvedValueOnce(piezaToRemove as any)

      const result = await service.remove(id)

      expect(result).toEqual(piezaToRemove)
      expect(piezaRepository.remove).toHaveBeenCalledWith(piezaToRemove)
    })

    it('should throw NotFoundException if pieza not found', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('removeSoft', () => {
    it('should remove a pieza logically by id', async () => {
      const id = '7fe81546-bec9-4356-a4f3-4913e1e8db80'
      const piezaToRemove = {
        id,
        nombre: 'test',
        description: 'test',
        image: 'test',
        isDeleted: false,
      }

      jest.spyOn(service, 'exists').mockResolvedValueOnce(piezaToRemove as any)

      jest
        .spyOn(piezaRepository, 'save')
        .mockResolvedValueOnce(piezaToRemove as any)

      const result = await service.removeSoft(id)

      expect(result).toEqual({ ...piezaToRemove, isDeleted: true })
      expect(piezaRepository.save).toHaveBeenCalledWith({
        ...piezaToRemove,
        isDeleted: true,
      })
    })

    it('should throw NotFoundException if pieza not found', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('exists', () => {
    it('should return pieza if exists', async () => {
      const id = '7fe81546-bec9-4356-a4f3-4913e1e8db80'
      const pieza = {
        id,
        nombre: 'test',
        description: 'test',
        image: 'test',
      }

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(pieza as any)

      const result = await service.exists(id)

      expect(result).toEqual(pieza)
    })

    it('should throw NotFoundException if pieza not found', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })
})
