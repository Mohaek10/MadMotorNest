import { Test, TestingModule } from '@nestjs/testing'
import { PiezaController } from './pieza.controller'
import { PiezaService } from './pieza.service'
import { CacheModule } from '@nestjs/cache-manager'
import { Paginated } from 'nestjs-paginate'
import { ResponsePiezaDto } from './dto/response-pieza.dto'
import { NotFoundException } from '@nestjs/common'
import { CreatePiezaDto } from './dto/create-pieza.dto'
import { UpdatePiezaDto } from './dto/update-pieza.dto'

describe('PiezaController', () => {
  let controller: PiezaController
  let service: PiezaService

  const piezaServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PiezaController],
      providers: [{ provide: PiezaService, useValue: piezaServiceMock }],
    }).compile()

    controller = module.get<PiezaController>(PiezaController)
    service = module.get<PiezaService>(PiezaService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
  describe('findAll', () => {
    it('obtener todas las piezas', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'pieza',
      }

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
      } as Paginated<ResponsePiezaDto>

      jest.spyOn(service, 'findAll').mockResolvedValue(testPiezas)
      const result: any = await controller.findAll(paginateOptions)

      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      expect(result.meta.totalPages).toEqual(1) // You may need to adjust this value based on your test case
      expect(result.links.current).toEqual(
        `pieza?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=id:ASC`,
      )
      expect(service.findAll).toHaveBeenCalled()
    })
  })
  describe('findOne', () => {
    it('obtener una pieza', async () => {
      const id = '1c7e091c-9d46-48cd-a695-9dc165a2e0b6'
      const mockResult: ResponsePiezaDto = new ResponsePiezaDto()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(mockResult).toBeInstanceOf(ResponsePiezaDto)
    })

    it('should throw NotFoundException if producto does not exist', async () => {
      const id = '1c7e091c-9046-48cd-a695-9dc165a2e0b6'
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })
  describe('create', () => {
    it('deberia crear una pieza', async () => {
      const dto: CreatePiezaDto = {
        nombre: 'test',
        descripcion: 'test',
        imagen: 'test',
        precio: 3,
        cantidad: 3,
      }
      const mockResult: ResponsePiezaDto = new ResponsePiezaDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      jest.spyOn(service, 'create').mockResolvedValue(mockResult)
      await controller.create(dto)
      expect(service.create).toHaveBeenCalledWith(dto)
      expect(mockResult).toBeInstanceOf(ResponsePiezaDto)
    })
  })
  describe('update', () => {
    it('actualiza un producto', async () => {
      const id = '1c7e091c-9046-48cd-a695-9dc165a2e0b6'
      const dto: UpdatePiezaDto = {
        nombre: 'test',
        descripcion: 'test',
        isDeleted: true,
      }
      const mockResult: ResponsePiezaDto = new ResponsePiezaDto()
      jest.spyOn(service, 'update').mockResolvedValue(mockResult)
      await controller.update(id, dto)
      expect(service.update).toHaveBeenCalledWith(id, dto)
      expect(mockResult).toBeInstanceOf(ResponsePiezaDto)
    })

    it('lanza excepcion si la pieza no existe', async () => {
      const id = '1c7e091c-9046-48cd-a605-9dc165a2e0b6'
      const dto: UpdatePiezaDto = {
        nombre: 'test',
        descripcion: 'test',
        isDeleted: true,
      }
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })
  describe('remove', () => {
    /*it('elimina un producto', async () => {
      const id = '1c7e091c-9d46-48cd-a695-9dc165a2e0b6'
      const mockResult: ResponsePiezaDto = new ResponsePiezaDto()

      jest.spyOn(service, 'remove').mockRejectedValue(id)
      await controller.remove(id)
      expect(service.remove(id)).toHaveBeenCalledWith(id)
    })

     */

    it('lanza NotFoundException si la pieza no existe', async () => {
      const id = '1c7e091c-9046-48cd-a698-9dc165a2e0b6'
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new NotFoundException(
            'Pieza con id 1c7e091c-9046-48cd-a695-9dc165a2e0b6 no encontrado',
          ),
        )
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
    })
  })
})
