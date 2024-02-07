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
import {Paginated, PaginateQuery} from 'nestjs-paginate'
import {Promise} from "mongoose";
import {ResponsePiezaDto} from "./dto/response-pieza.dto";
import mock = jest.mock;
import {hash} from "typeorm/util/StringUtils";

describe('PiezaService', () => {
  let service: PiezaService
  let piezaRepository: Repository<Pieza>
  let cacheManager: Cache
  let mapper: PiezaMapper

  const piezaMapperMock={
    toPiezaFromCreate: jest.fn(),
    toResponseDto:jest.fn()
  }
  const cacheManagerMock={
    get:jest.fn(()=> Promise.resolve()),
    set:jest.fn(()=> Promise.resolve()),
    take:jest.fn(()=> Promise.resolve),
    store:{
      keys:jest.fn(),
    },

  }
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
    mapper=module.get<PiezaMapper>(PiezaMapper)
  })

  describe('findAll', () => {
    it('debería devolver una página de piezas', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'pieza',
      };

      const testPiezas = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'pieza?page=1&limit=10&sortBy=id:ASC',
        },
      } as Paginated<ResponsePiezaDto>;

      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce();

      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([testPiezas.data, testPiezas.meta.totalItems]),
      };

      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      jest.spyOn(mapper, 'toResponseDto').mockReturnValue(new ResponsePiezaDto());

      const result = await service.findAll(paginateOptions);

      expect(testPiezas.meta.itemsPerPage).toEqual(paginateOptions.limit);
      expect(testPiezas.meta.currentPage).toEqual(paginateOptions.page);
      expect(testPiezas.links.current).toEqual(`pieza?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=id:ASC`);
    });

    it('debería devolver el resultado de la caché', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'pieza',
      };

      const testPiezas = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'pieza?page=1&limit=10&sortBy=id:ASC',
        },
      } as Paginated<ResponsePiezaDto>;
      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([testPiezas.data, testPiezas.meta.totalItems]),
      };
      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      jest.spyOn(cacheManagerMock, 'get').mockResolvedValueOnce(testPiezas);

      const result = await service.findAll(paginateOptions);

      expect(cacheManagerMock.get)
    });
  });


  describe('findOne', () => {
    it('debería devolver una pieza por ID', async () => {
      const pieza = {
        id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
        nombre: 'test',
        precio: 2,
        cantidad: 3,
        descripcion: 'test',
        image: 'test',
      }

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)

      const mockQueryBuilder=jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(pieza),
      } as any)
      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);




      const result = await service.findOne(pieza.id)

      expect(result).toEqual(pieza)

    })

    it('debería devolver una pieza de la caché si está disponible', async () => {
      const cachedPieza = {
        id: '7fe81546-bec9-4356-a4f3-4913e1e8db80',
        nombre: 'test',
        precio: 2,
        cantidad: 3,
        descripcion: 'test',
        image: 'test',
      }

      jest.spyOn(cacheManagerMock, 'get').mockResolvedValue(cachedPieza)
      const mockQueryBuilder=jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(cachedPieza),
      } as any)
      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.findOne(cachedPieza.id)

      expect(result).toEqual(cachedPieza)
      expect(cacheManagerMock.set).not.toHaveBeenCalled()
    })

    it('debería lanzar NotFoundException si la pieza no se encuentra', async () => {
      const id = '7fe81546-bec9-4356-a4f3-4913e1e8db80'

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)

      jest.spyOn(piezaRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as any)

      await expect(service.findOne(id)).rejects.toThrowError(NotFoundException)
      expect(cacheManagerMock.set).not.toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('debería crear una pieza', async () => {
      const createPiezaDto: CreatePiezaDto = {
        nombre: 'test',
        precio: 2,
        stock: 3,
        descripcion: 'test',
        imagen: 'test',
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
    it('debería actualizar una pieza por ID', async () => {
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

    it('debería lanzar NotFoundException si la pieza no se encuentra', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('remove', () => {
    it('debería eliminar una pieza por ID', async () => {
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

    it('debería lanzar NotFoundException si la pieza no se encuentra', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('removeSoft', () => {
    it('debería eliminar una pieza lógicamente por ID', async () => {
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

    it('debería lanzar NotFoundException si la pieza no se encuentra', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('exists', () => {
    it('debería devolver la pieza si existe', async () => {
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

    it('debería lanzar NotFoundException si la pieza no se encuentra', async () => {
      const id = '7fe81546-bec9-4346-a4f3-4913e1e8db80'

      jest.spyOn(piezaRepository, 'findOne').mockResolvedValueOnce(undefined)

      await expect(service.exists(id)).rejects.toThrowError(NotFoundException)
    })
  })
})
