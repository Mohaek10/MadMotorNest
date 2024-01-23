import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasController } from './categorias.controller'
import { CategoriasService } from './categorias.service'
import { CacheModule } from '@nestjs/cache-manager'
import { Paginated } from 'nestjs-paginate'
import { Categoria } from './entities/categoria.entity'
import { NotFoundException } from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'

describe('CategoriasController', () => {
  let controller: CategoriasController
  let service: CategoriasService

  const mockCategoriaService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CategoriasController],
      providers: [
        { provide: CategoriasService, useValue: mockCategoriaService },
      ],
    }).compile()

    controller = module.get<CategoriasController>(CategoriasController)
    service = module.get<CategoriasService>(CategoriasService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should get all categorias', async () => {
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
      jest.spyOn(service, 'findAll').mockResolvedValue(testCategories)
      const result: any = await controller.findAll(paginateOptions)

      // console.log(result)
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      // Expect the result to have the correct currentPage
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      // Expect the result to have the correct totalPages
      expect(result.meta.totalPages).toEqual(1) // You may need to adjust this value based on your test case
      // Expect the result to have the correct current link
      expect(result.links.current).toEqual(
        `categorias?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=nombre:ASC`,
      )
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should get one categoria', async () => {
      const id = 'uuid'
      const mockResult: Categoria = new Categoria()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(mockResult).toBeInstanceOf(Categoria)
    })

    it('should throw NotFoundException if categoria does not exist', async () => {
      const id = 'a uuid'
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a categoria', async () => {
      const dto: CreateCategoriaDto = {
        nombre: 'test',
      }
      const mockResult: Categoria = new Categoria()
      jest.spyOn(service, 'create').mockResolvedValue(mockResult)
      await controller.create(dto)
      expect(service.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('update', () => {
    it('should update a categoria', async () => {
      const id = 'a uuid'
      const dto: UpdateCategoriaDto = {
        nombre: 'test',
        isDeleted: true,
      }
      const mockResult: Categoria = new Categoria()
      jest.spyOn(service, 'update').mockResolvedValue(mockResult)
      await controller.update(id, dto)
      expect(service.update).toHaveBeenCalledWith(id, dto)
      expect(mockResult).toBeInstanceOf(Categoria)
    })

    it('should throw NotFoundException if categoria does not exist', async () => {
      const id = 'a uuid'
      const dto: UpdateCategoriaDto = {}
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(id, dto)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('should remove a categoria', async () => {
      const id = 'a uuid'
      const mockResult: Categoria = new Categoria()
      jest.spyOn(service, 'remove').mockResolvedValue(mockResult)
      await controller.remove(id)
      expect(service.remove).toHaveBeenCalledWith(id)
    })

    it('should throw NotFoundException if categoria does not exist', async () => {
      const id = 'a uuid'
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
    })
  })
})
