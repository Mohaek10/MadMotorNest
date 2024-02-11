import { Test, TestingModule } from '@nestjs/testing'
import { PersonalController } from './personal.controller'
import { PersonalService } from './personal.service'
import { Paginated } from 'nestjs-paginate'
import { Personal } from './entities/personal.entity'
import { ResponsePersonalDto } from './dto/response-personal.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreatePersonalDto } from './dto/create-personal.dto'
import { UpdatePersonalDto } from './dto/update-personal.dto'

describe('PersonalController', () => {
  let controller: PersonalController
  let service: PersonalService

  const mockPersonalService = {
    findAll: jest.fn(() => []),
    findOne: jest.fn(() => ({})),
    create: jest.fn(() => ({})),
    update: jest.fn(() => ({})),
    remove: jest.fn(() => ({})),
    invalidateCacheKey: jest.fn(() => ({})),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalController],
      providers: [{ provide: PersonalService, useValue: mockPersonalService }],
    }).compile()

    controller = module.get<PersonalController>(PersonalController)
    service = module.get<PersonalService>(PersonalService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of personal', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'personal',
      }
      const testPersonal = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'personal?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<Personal>

      jest.spyOn(service, 'findAll').mockResolvedValue(testPersonal)
      const result: any = await controller.findAll(paginateOptions)

      expect(result.meta).toEqual(testPersonal.meta)
      expect(result.links).toEqual(testPersonal.links)
      expect(result.data).toEqual(testPersonal.data)
      expect(result.links.current).toEqual(
        'personal?page=1&limit=10&sortBy=nombre:ASC',
      )
      expect(result.meta.itemsPerPage).toEqual(10)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a personal', async () => {
      const id = 1
      const testPersonal = new ResponsePersonalDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(testPersonal)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(service.findOne).toHaveBeenCalledTimes(1)
    })
    it('should return an error NotFoundException if personal not exist', async () => {
      const id = 1
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(service.findOne).toHaveBeenCalledTimes(2)
    })
    it('Return BadRequestException if id is not a number', async () => {
      const id = 'a'
      jest
        .spyOn(controller, 'findOne')
        .mockRejectedValue(new BadRequestException())
      await expect(controller.findOne(+id)).rejects.toThrow(BadRequestException)
      expect(service.findOne).toHaveBeenCalledTimes(2)
    })
  })

  describe('create', () => {
    it('should create a personal', async () => {
      const testPersonal: CreatePersonalDto = {
        nombre: 'Juan',
        apellidos: 'Gonzalez',
        dni: '12345678A',
        telefono: '916947845',
        fechaNacimiento: '19-12-2010',
        sueldo: 1000,
        iban: 'ES7921000813610123456789',
        email: 'juangon@gmail.com',
        direccion: 'Calle Mayor 12',
      }
      const testPersonalResponse: ResponsePersonalDto =
        new ResponsePersonalDto()
      jest.spyOn(service, 'create').mockResolvedValue(testPersonalResponse)
      await controller.create(testPersonal)
      expect(service.create).toHaveBeenCalledWith(testPersonal)
      expect(service.create).toHaveBeenCalledTimes(1)
    })
    it('should return an error BadRequestException if dto is not valid', async () => {
      const testPersonal: CreatePersonalDto = {
        nombre: 'Juan',
        apellidos: 'Gonzalez',
        dni: '12345678A',
        telefono: '916947845',
        fechaNacimiento: '19-12-2010',
        sueldo: 1000,
        iban: 'ES7921000813610123456789',
        email: 'juangon@gmail.com',
        direccion: 'Calle Mayor 12',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException())
      await expect(controller.create(testPersonal)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.create).toHaveBeenCalledTimes(2)
      expect(service.create).toHaveBeenCalledWith(testPersonal)
    })
  })

  describe('update', () => {
    it('should update a personal', async () => {
      const id = 1
      const testPersonal: UpdatePersonalDto = {
        direccion: 'Calle Mayor 12',
        telefono: '916947845',
        email: 'juangon@gmai.com',
        sueldo: 1000,
        iban: 'ES7921000813610123456789',
      }
      const testPersonalResponse: ResponsePersonalDto =
        new ResponsePersonalDto()
      jest.spyOn(service, 'update').mockResolvedValue(testPersonalResponse)
      const resultado = await controller.update(id, testPersonal)
      expect(service.update).toHaveBeenCalledWith(id, testPersonal)
      expect(resultado).toEqual(testPersonalResponse)
    })
    it('should return an error NotFoundException if personal not exist', async () => {
      const id = 1
      const testPersonal: UpdatePersonalDto = {
        direccion: 'Calle Mayor 12',
        telefono: '916947845',
        email: 'juangon@gmail.com',
        sueldo: 1000,
        iban: 'ES7921000813610123456789',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(id, testPersonal)).rejects.toThrow(
        NotFoundException,
      )
      expect(service.update).toHaveBeenCalledTimes(2)
      expect(service.update).toHaveBeenCalledWith(id, testPersonal)
    })
    it('should return an error BadRequestException if dto is not valid', async () => {
      const id = 1
      const testPersonal: UpdatePersonalDto = {
        direccion: 'Calle Mayor 12',
        telefono: '916947845',
        email: 'juangon@gmail.com',
        sueldo: 1000,
        iban: 'ES7921000813610123456789',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())
      await expect(controller.update(id, testPersonal)).rejects.toThrow(
        BadRequestException,
      )
      expect(service.update).toHaveBeenCalledTimes(3)
      expect(service.update).toHaveBeenCalledWith(id, testPersonal)
    })
  })

  describe('remove', () => {
    it('should remove a personal', async () => {
      const id = 1
      const testPersonalResponse: ResponsePersonalDto =
        new ResponsePersonalDto()
      jest.spyOn(service, 'remove').mockResolvedValue(testPersonalResponse)
      const resultado = await controller.remove(id)
      expect(service.remove).toHaveBeenCalledWith(id)
      expect(resultado).toEqual(testPersonalResponse)
    })
    it('should return an error NotFoundException if personal not exist', async () => {
      const id = 1
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
      expect(service.remove).toHaveBeenCalledTimes(2)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
