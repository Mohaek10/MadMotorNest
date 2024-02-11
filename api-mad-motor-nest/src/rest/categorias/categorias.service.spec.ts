import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasService } from './categorias.service'
import { Repository } from 'typeorm'
import { Categoria } from './entities/categoria.entity'
import { CategoriasMapper } from './mappers/categorias.mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Paginated } from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { NotFoundException } from '@nestjs/common'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'

describe('CategoriasService', () => {
  let service: CategoriasService
  let repository: Repository<Categoria>
  let mapper: CategoriasMapper
  let managerCache: Cache

  const categoriasMapperMock = {
    mapCreateDtotoEntity: jest.fn,
  }

  const managerCacheMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: CategoriasMapper, useValue: categoriasMapperMock },
        {
          provide: getRepositoryToken(Categoria),
          useClass: Repository,
        },
        { provide: CACHE_MANAGER, useValue: managerCacheMock },
      ],
    }).compile()

    service = module.get<CategoriasService>(CategoriasService)
    repository = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    )
    mapper = module.get<CategoriasMapper>(CategoriasMapper)
    managerCache = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return a page of categories', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'categorias',
      }

      const testCategorias = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'categorias?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<Categoria>

      jest.spyOn(managerCache, 'get').mockResolvedValue(Promise.resolve(null))

      jest.spyOn(managerCache, 'set').mockResolvedValue()

      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([testCategorias, 1]),
      }

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      const result: any = await service.findAll(paginateOptions)

      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      expect(result.meta.totalPages).toEqual(1)
      expect(result.links.current).toEqual(
        `categorias?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=nombre:ASC`,
      )
      expect(managerCache.get).toHaveBeenCalled()
      expect(managerCache.set).toHaveBeenCalled()
    })

    it('should return cached result', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'categorias',
      }

      const testCategories = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'categorias?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<Categoria>

      jest.spyOn(managerCache, 'get').mockResolvedValue(testCategories)

      const result = await service.findAll(paginateOptions)

      expect(managerCache.get).toHaveBeenCalledWith(
        `all_categorias_page_${hash(JSON.stringify(paginateOptions))}`,
      )

      expect(result).toEqual(testCategories)
    })
  })

  describe('findOne', () => {
    it('should return a single category', async () => {
      const testCategory = new Categoria()
      jest.spyOn(managerCache, 'get').mockResolvedValue(Promise.resolve(null))

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(testCategory)

      jest.spyOn(managerCache, 'set').mockResolvedValue()

      expect(await service.findOne('1')).toEqual(testCategory)
    })

    it('should throw an error if the category does not exist', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should successfully insert a category', async () => {
      const testCategory = new Categoria()
      testCategory.nombre = 'test'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(), // Añade esto
        getOne: jest.fn().mockResolvedValue(null),
      }

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(mapper, 'mapCreateDtotoEntity').mockReturnValue(testCategory)
      jest.spyOn(repository, 'save').mockResolvedValue(testCategory)
      jest.spyOn(service, 'exists').mockResolvedValue(null) // Simula la función 'exists'

      jest.spyOn(managerCache.store, 'keys').mockResolvedValue([])

      expect(await service.create(new CreateCategoriaDto())).toEqual(
        testCategory,
      )
      expect(mapper.mapCreateDtotoEntity).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should call the update method', async () => {
      const testCategory = new Categoria()
      testCategory.nombre = 'test'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(testCategory),
      }

      const mockUpdateCategoriaDto = new UpdateCategoriaDto()

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(service, 'exists').mockResolvedValue(testCategory) // Simula la función 'exists'
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(testCategory)
      jest.spyOn(mapper, 'mapCreateDtotoEntity').mockReturnValue(testCategory)
      jest.spyOn(repository, 'save').mockResolvedValue(testCategory)

      const result = await service.update('1', mockUpdateCategoriaDto)

      expect(result).toEqual(testCategory)
    })
  })

  describe('remove', () => {
    it('should call the delete method', async () => {
      const testCategory = new Categoria()
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(testCategory)
      jest.spyOn(repository, 'remove').mockResolvedValue(testCategory)

      expect(await service.remove('1')).toEqual(testCategory)
    })
  })
  describe('removeSoft', () => {
    it('should call the soft delete method', async () => {
      const testCategory = new Categoria()
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(testCategory)
      jest.spyOn(repository, 'save').mockResolvedValue(testCategory)

      expect(await service.removeSoft('1')).toEqual(testCategory)
    })
  })
})
