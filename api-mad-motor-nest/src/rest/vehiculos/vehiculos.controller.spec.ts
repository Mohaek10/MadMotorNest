import { Test, TestingModule } from '@nestjs/testing'
import { VehiculosController } from './vehiculos.controller'
import { VehiculosService } from './vehiculos.service'
import { Paginated } from 'nestjs-paginate'
import { Vehiculo } from './entities/vehiculo.entity'
import { ResponseVehiculoDto } from './dto/response-vehiculo.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateVehiculoDto } from './dto/create-vehiculo.dto'
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto'
import { Express } from 'express'
import { Request } from 'express'

describe('VehiculosController', () => {
  let controller: VehiculosController
  let service: VehiculosService

  const mockVehiculosService = {
    findAll: jest.fn(() => []),
    findOne: jest.fn(() => ({})),
    create: jest.fn(() => ({})),
    update: jest.fn(() => ({})),
    remove: jest.fn(() => ({})),
    borradoLogico: jest.fn(() => ({})),
    actualizarImagenVehiculo: jest.fn(() => ({})),
    invalidateCacheKey: jest.fn(() => ({})),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiculosController],
      providers: [
        {
          provide: VehiculosService,
          useValue: mockVehiculosService,
        },
      ],
    }).compile()

    controller = module.get<VehiculosController>(VehiculosController)
    service = module.get<VehiculosService>(VehiculosService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
  describe('findAll', () => {
    it('should return an array of vehiculos', async () => {
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
      } as Paginated<Vehiculo>

      jest.spyOn(service, 'findAll').mockResolvedValue(testVehiculos)
      const result: any = await controller.findAll(paginateOptions)

      expect(result.meta).toEqual(testVehiculos.meta)
      expect(result.links).toEqual(testVehiculos.links)
      expect(result.data).toEqual(testVehiculos.data)
      expect(result.links.current).toEqual(
        'vehiculos?page=1&limit=10&sortBy=marca:ASC',
      )
      expect(result.meta.itemsPerPage).toEqual(10)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('Devuelve el vehiculo existente', async () => {
      const id = 1
      const resultMock = new ResponseVehiculoDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(resultMock)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(service.findOne).toHaveBeenCalledTimes(1)
    })
    it('Devuelve un error: NotFoundException si el vehiculo no existe', async () => {
      const id = 1
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(service.findOne).toHaveBeenCalledTimes(2)
    })
    it('Devueve BadRequestException si el id no es un numero', async () => {
      const id = 'a'
      jest
        .spyOn(controller, 'findOne')
        .mockRejectedValue(new BadRequestException())
      await expect(controller.findOne(+id)).rejects.toThrow(BadRequestException)
      expect(service.findOne).toHaveBeenCalledTimes(2)
    })
  })
  describe('create', () => {
    it('Crea un vehiculo', async () => {
      const createVehiculoDto: CreateVehiculoDto = {
        marca: 'marca',
        modelo: 'modelo',
        year: 2021,
        km: 100,
        precio: 100000,
        stock: 10,
        image: 'image',
        categoria: 'categoria',
      }
      const resultMock: ResponseVehiculoDto = new ResponseVehiculoDto()
      jest.spyOn(service, 'create').mockResolvedValue(resultMock)
      await controller.create(createVehiculoDto)
      expect(service.create).toHaveBeenCalledWith(createVehiculoDto)
      expect(service.create).toHaveBeenCalledTimes(1)
    })
    it('Devuelve BadRequestException si el dto no es valido', async () => {
      const createVehiculoDto: CreateVehiculoDto = {
        marca: 'marca',
        modelo: 'modelo',
        year: 2021,
        km: 100,
        precio: 100000,
        stock: 10,
        image: 'image',
        categoria: 'categoria',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException())
      await expect(controller.create(createVehiculoDto)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.create).toHaveBeenCalledTimes(2)
      expect(service.create).toHaveBeenCalledWith(createVehiculoDto)
    })
  })

  describe('update', () => {
    it('should update a product', async () => {
      const id = 1
      const dto: UpdateVehiculoDto = {
        marca: 'bmw',
      }
      const res: ResponseVehiculoDto = new ResponseVehiculoDto()
      jest.spyOn(service, 'update').mockResolvedValue(res)
      const result = await controller.update(id, dto)
      expect(service.update).toHaveBeenCalledWith(id, dto)
      expect(result).toEqual(res)
    })
    it('Devuelve NotFoundException al no encontrar un vehiculo', async () => {
      const id = 1
      const updateDto: UpdateVehiculoDto = {
        marca: 'bmw',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      )
      expect(service.update).toHaveBeenCalledTimes(2)
      expect(service.update).toHaveBeenCalledWith(id, updateDto)
    })
    it('Devuelve BadRequestException si el dto no es valido', async () => {
      const id = 1
      const updateDto: UpdateVehiculoDto = {
        marca: 'bmw',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())
      await expect(controller.update(id, updateDto)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.update).toHaveBeenCalledTimes(3)
      expect(service.update).toHaveBeenCalledWith(id, updateDto)
    })
  })
  describe('remove', () => {
    it('should remove a vehiculo', async () => {
      const id = 1
      const res: ResponseVehiculoDto = new ResponseVehiculoDto()
      jest.spyOn(service, 'borradoLogico').mockResolvedValue(res)
      const result = await controller.remove(id)
      expect(service.borradoLogico).toHaveBeenCalledWith(id)
      expect(result).toEqual(res)
    })
    it('Devuelve NotFoundException al no encontrar un vehiculo', async () => {
      const id = 1
      jest
        .spyOn(service, 'borradoLogico')
        .mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
      expect(service.borradoLogico).toHaveBeenCalledTimes(2)
      expect(service.borradoLogico).toHaveBeenCalledWith(id)
    })
  })
  describe('actualizarImagenVehiculo', () => {
    it('Actualiza la imagen del vehiculo', async () => {
      const id = 1
      const file = {} as Express.Multer.File
      const req = {} as Request
      const mockRes: ResponseVehiculoDto = new ResponseVehiculoDto()
      jest.spyOn(service, 'actualizarImagenVehiculo').mockResolvedValue(mockRes)
      await controller.actualizarImagenVehiculo(id, file, req)
      expect(service.actualizarImagenVehiculo).toHaveBeenCalledWith(
        id,
        file,
        req,
        true,
      )
      expect(service.actualizarImagenVehiculo).toHaveBeenCalledTimes(1)
    })
    it('Devuelve BadRequestException si no se envia una imagen', async () => {
      const id = 1
      const file = null
      const req = {} as Request
      const mockRes: ResponseVehiculoDto = new ResponseVehiculoDto()
      jest
        .spyOn(service, 'actualizarImagenVehiculo')
        .mockRejectedValue(new BadRequestException())
      await expect(
        controller.actualizarImagenVehiculo(id, file, req),
      ).rejects.toThrow(BadRequestException)
      expect(service.actualizarImagenVehiculo).toHaveBeenCalledTimes(1)
      expect(mockRes).toBeInstanceOf(ResponseVehiculoDto)
    })
  })
})
