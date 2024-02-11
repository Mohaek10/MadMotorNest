import { INestApplication, NotFoundException } from '@nestjs/common'
import { ResponseVehiculoDto } from '../../../src/rest/vehiculos/dto/response-vehiculo.dto'
import { CreateVehiculoDto } from '../../../src/rest/vehiculos/dto/create-vehiculo.dto'
import { UpdateVehiculoDto } from '../../../src/rest/vehiculos/dto/update-vehiculo.dto'
import { Test, TestingModule } from '@nestjs/testing'
import { VehiculosController } from '../../../src/rest/vehiculos/vehiculos.controller'
import { VehiculosService } from '../../../src/rest/vehiculos/vehiculos.service'
import { JwtAuthGuard } from '../../../src/rest/auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../src/rest/auth/guards/roles-auth.guard'
import * as request from 'supertest'
describe('VehiculosController (e2e)', () => {
  let app: INestApplication
  const url = '/vehiculos'
  const vehiculoResponse: ResponseVehiculoDto = {
    id: 1,
    marca: 'Toyota',
    modelo: 'Corolla',
    year: 2021,
    km: 0,
    precio: 100000,
    stock: 1,
    image: 'https://www.google.com',
    createdAt: new Date(),
    updateAt: new Date(),
    isDeleted: false,
    categoria: 'Sedan',
  }

  const vehiculoCreate: CreateVehiculoDto = {
    marca: 'Toyota',
    modelo: 'Corolla',
    year: 2021,
    km: 0,
    precio: 100000,
    stock: 1,
    image: 'https://www.google.com',
    categoria: 'Sedan',
  }
  const vehiculoUpdate: UpdateVehiculoDto = {
    marca: 'Toyota',
    modelo: 'Corolla',
  }

  const mockVehiculoService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    borradoLogico: jest.fn(),
    actualizarImagenVehiculo: jest.fn(),
    invalidateCacheKey: jest.fn(),
  }

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [VehiculosController],
      providers: [
        VehiculosService,
        {
          provide: VehiculosService,
          useValue: mockVehiculoService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })
  afterAll(async () => {
    await app.close()
  })

  describe('GET /vehiculos', () => {
    it('should return a page of vehiculos', async () => {
      mockVehiculoService.findAll.mockResolvedValue([vehiculoResponse])
      const { body } = await request(app.getHttpServer()).get(url).expect(200)
      expect(() => {
        expect(body).toEqual([vehiculoResponse])
        expect(mockVehiculoService.findAll).toHaveBeenCalled()
      })
    })
    it('should return a page with a query', async () => {
      mockVehiculoService.findAll.mockResolvedValue([vehiculoResponse])
      const { body } = await request(app.getHttpServer())
        .get(`${url}?page=1&limit=10`)
        .expect(200)
      expect(() => {
        expect(body).toEqual([vehiculoResponse])
        expect(mockVehiculoService.findAll).toHaveBeenCalled()
      })
    })
  })
  describe('GET /vehiculos/:id', () => {
    it('should return a vehiculo', async () => {
      mockVehiculoService.findOne.mockResolvedValue(vehiculoResponse)
      const { body } = await request(app.getHttpServer())
        .get(`${url}/1`)
        .expect(200)
      expect(() => {
        expect(body).toEqual(vehiculoResponse)
        expect(mockVehiculoService.findOne).toHaveBeenCalled()
      })
    })
  })
  describe('POST /vehiculos', () => {
    it('should create a vehiculo', async () => {
      mockVehiculoService.create.mockResolvedValue(vehiculoResponse)
      const { body } = await request(app.getHttpServer())
        .post(url)
        .send(vehiculoCreate)
        .expect(201)
      expect(() => {
        expect(body).toEqual(vehiculoResponse)
        expect(mockVehiculoService.create).toHaveBeenCalled()
      })
    })
  })
  describe('PUT /vehiculos/:id', () => {
    it('should update a vehiculo', async () => {
      mockVehiculoService.update.mockResolvedValue(vehiculoResponse)
      const { body } = await request(app.getHttpServer())
        .put(`${url}/${vehiculoResponse.id}`)
        .send(vehiculoUpdate)
      expect(() => {
        expect(body).toEqual(vehiculoResponse)
        expect(mockVehiculoService.update).toHaveBeenCalled()
      })
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      mockVehiculoService.update.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .put(`${url}/${vehiculoResponse.id}`)
        .send(vehiculoUpdate)
        .expect(404)
    })
  })
  describe('DELETE /vehiculos/:id', () => {
    it('should delete a vehiculo', async () => {
      mockVehiculoService.borradoLogico.mockResolvedValue(vehiculoResponse)
      await request(app.getHttpServer())
        .delete(`${url}/${vehiculoResponse.id}`)
        .expect(204)
    })
    it('should throw an error if the vehiculo does not exist', async () => {
      mockVehiculoService.borradoLogico.mockRejectedValue(
        new NotFoundException(),
      )
      await request(app.getHttpServer())
        .delete(`${url}/${vehiculoResponse.id}`)
        .expect(404)
    })
  })
  describe('PATCH /vehiculos/:id/image', () => {
    it('should update the image of a vehiculo', async () => {
      mockVehiculoService.actualizarImagenVehiculo.mockResolvedValue(
        vehiculoResponse,
      )
      request(app.getHttpServer())
        .patch(`${url}/1/image`)
        .send({ image: 'https://www.google.com' })
        .expect(200)
      expect(() => {
        expect(mockVehiculoService.actualizarImagenVehiculo).toHaveBeenCalled()
      })
    })
  })
})
