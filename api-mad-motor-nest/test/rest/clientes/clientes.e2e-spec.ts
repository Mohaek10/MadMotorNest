import { INestApplication, NotFoundException } from '@nestjs/common'
import { Cliente } from '../../../src/rest/clientes/entities/cliente.entity'
import { CreateClienteDto } from '../../../src/rest/clientes/dto/create-cliente.dto'
import { UpdateClienteDto } from '../../../src/rest/clientes/dto/update-cliente.dto'
import { ResponseClienteDto } from '../../../src/rest/clientes/dto/response-cliente.dto'
import { Test, TestingModule } from '@nestjs/testing'
import { CacheModule } from '@nestjs/cache-manager'
import { JwtAuthGuard } from '../../../src/rest/auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../src/rest/auth/guards/roles-auth.guard'
import { ClientesController } from '../../../src/rest/clientes/clientes.controller'
import { ClientesService } from '../../../src/rest/clientes/clientes.service'
import * as request from 'supertest'

describe('Clientes controller', () => {
  let app: INestApplication
  const myEndpoint = `/clientes`
  const clienteEntity: Cliente = {
    id: 1,
    nombre: 'nombre',
    apellido: 'apellido',
    direccion: 'direccion',
    codigoPostal: 12345,
    dni: '12345678X',
    imagen: 'https://via.placeholder.com/150',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const createClienteDto: CreateClienteDto = {
    nombre: 'nombre',
    apellido: 'apellido',
    direccion: 'direccion',
    codigoPostal: 12345,
    dni: '12345678X',
  }
  const updateClienteDto: UpdateClienteDto = {
    nombre: 'nombre',
    apellido: 'apellido',
    direccion: 'direccion',
    codigoPostal: 12345,
    dni: '12345678X',
    imagen: 'https://via.placeholder.com/150',
    isDeleted: false,
  }
  const responseCLiente: ResponseClienteDto = {
    id: 1,
    nombre: 'nombre',
    apellido: 'apellido',
    direccion: 'direccion',
    codigoPostal: 12345,
    dni: '12345678X',
    imagen: 'https://via.placeholder.com/150',
    isDeleted: false,
    createdAt: clienteEntity.createdAt,
    updatedAt: clienteEntity.updatedAt,
  }
  const mockClienteService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    actualizarImagenCliente: jest.fn(),
  }
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [ClientesController],
      providers: [
        ClientesService,
        { provide: ClientesService, useValue: mockClienteService },
      ],
    })

      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesAuthGuard)
      .useValue({ canActivate: () => true })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })
  afterAll(async () => {
    await app.close()
  })
  describe('Get /clientes', () => {
    it('should return an array of clientes', async () => {
      mockClienteService.findAll.mockResolvedValue([clienteEntity])
      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)
      expect(() => {
        expect(body).toEqual([responseCLiente])
        expect(mockClienteService.findAll).toHaveBeenCalled()
      })
    })
    it('se aplican filtros', async () => {
      mockClienteService.findAll.mockResolvedValue([clienteEntity])
      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}?page=1&limit=10`)
        .expect(200)
      expect(() => {
        expect(body).toEqual([responseCLiente])
        expect(mockClienteService.findAll).toHaveBeenCalled()
      })
    })
  })
  describe('Get /clientes/:id', () => {
    it('should return a cliente', async () => {
      mockClienteService.findOne.mockResolvedValue(clienteEntity)
      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}/${clienteEntity.id}`)
        .expect(200)
      expect(() => {
        expect(body).toEqual(responseCLiente)
        expect(mockClienteService.findOne).toHaveBeenCalled()
      })
    })
    it('should return a 404', async () => {
      mockClienteService.findOne.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer()).get(`${myEndpoint}/9999`).expect(404)
    })
  })
  describe('Post /clientes', () => {
    it('should create a cliente', async () => {
      mockClienteService.create.mockResolvedValue(clienteEntity)
      const { body } = await request(app.getHttpServer())
        .post(myEndpoint)
        .send(createClienteDto)
        .expect(201)
      expect(() => {
        expect(body).toEqual(responseCLiente)
        expect(mockClienteService.create).toHaveBeenCalled()
      })
    })
  })
  describe('Put /clientes/:id', () => {
    it('should update a cliente', async () => {
      mockClienteService.update.mockResolvedValue(clienteEntity)
      mockClienteService.findOne.mockResolvedValue(clienteEntity)
      const { body } = await request(app.getHttpServer())
        .put(`${myEndpoint}/${clienteEntity.id}`)
        .send(updateClienteDto)
      expect(() => {
        expect(body).toEqual(responseCLiente)
        expect(mockClienteService.update).toHaveBeenCalled()
      })
    })
    it('should throw an error if the cliente does not exist', async () => {
      mockClienteService.update.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .put(`${myEndpoint}/${clienteEntity.id}`)
        .send(updateClienteDto)
        .expect(404)
    })
  })
  describe('Delete /clientes/:id', () => {
    it('should delete a cliente', async () => {
      mockClienteService.remove.mockResolvedValue(clienteEntity)
      const { body } = await request(app.getHttpServer())
        .delete(`${myEndpoint}/${clienteEntity.id}`)
        .expect(200)
      expect(() => {
        expect(body).toEqual(responseCLiente)
        expect(mockClienteService.remove).toHaveBeenCalled()
      })
    })
    it('should throw an error if the cliente does not exist', async () => {
      mockClienteService.remove.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${clienteEntity.id}`)
        .expect(404)
    })
  })
})
