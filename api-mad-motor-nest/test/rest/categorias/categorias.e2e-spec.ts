import { INestApplication, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { CacheModule } from '@nestjs/cache-manager'
import { CategoriasController } from '../../../src/rest/categorias/categorias.controller'
import { CategoriasService } from '../../../src/rest/categorias/categorias.service'
import { JwtAuthGuard } from '../../../src/rest/auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../src/rest/auth/guards/roles-auth.guard'
import { Categoria } from '../../../src/rest/categorias/entities/categoria.entity'

describe('CategoriasController (e2e)', () => {
  let app: INestApplication
  const myEndpoint = `/categorias`

  const categoria: Categoria = {
    id: '7958ef01-9fe0-4f19-a1d5-79c917290ddf',
    nombre: 'nombre',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    vehiculos: [],
  }

  const createCategoriaDto = {
    nombre: 'nombre',
  }

  const updateCategoriaDto = {
    nombre: 'nombre',
    isDeleted: false,
  }

  const mockCategoriasService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeSoft: jest.fn(),
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CategoriasController],
      providers: [
        CategoriasService,
        { provide: CategoriasService, useValue: mockCategoriasService },
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

  describe('GET /categorias', () => {
    it('devuelve una pagina de categorias', async () => {
      mockCategoriasService.findAll.mockResolvedValue([categoria])

      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)
      expect(() => {
        expect(body).toEqual([categoria])
        expect(mockCategoriasService.findAll).toHaveBeenCalled()
      })
    })

    it('devuelve una pagina de categorias con query', async () => {
      mockCategoriasService.findAll.mockResolvedValue([categoria])

      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}?limit=10&page=1`)
        .expect(200)
      expect(() => {
        expect(body).toEqual([categoria])
        expect(mockCategoriasService.findAll).toHaveBeenCalled()
      })
    })
  })

  describe('GET /categorias/:id', () => {
    it('devuelve una categoria', async () => {
      mockCategoriasService.findOne.mockResolvedValue(categoria)

      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}/${categoria.id}`)
        .expect(200)
      expect(() => {
        expect(body).toEqual(categoria)
        expect(mockCategoriasService.findOne).toHaveBeenCalled()
      })
    })

    it('lanza un error 404 si la categoria no existe', async () => {
      mockCategoriasService.findOne.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .get(`${myEndpoint}/${categoria.id}`)
        .expect(404)
    })
  })

  describe('POST /categorias', () => {
    it('crea una nueva categoria', async () => {
      mockCategoriasService.create.mockResolvedValue(categoria)

      const { body } = await request(app.getHttpServer())
        .post(myEndpoint)
        .send(createCategoriaDto)
        .expect(201)
      expect(() => {
        expect(body).toEqual(categoria)
        expect(mockCategoriasService.create).toHaveBeenCalledWith(
          createCategoriaDto,
        )
      })
    })
  })

  describe('PUT /categorias/:id', () => {
    it('actualiza una categoria', async () => {
      mockCategoriasService.update.mockResolvedValue(categoria)

      const { body } = await request(app.getHttpServer())
        .put(`${myEndpoint}/${categoria.id}`)
        .send(updateCategoriaDto)
        .expect(200)
      expect(() => {
        expect(body).toEqual(categoria)
        expect(mockCategoriasService.update).toHaveBeenCalledWith(
          categoria.id,
          updateCategoriaDto,
        )
      })
    })

    it('lanza un error 404 si la categoria no existe', async () => {
      mockCategoriasService.update.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .put(`${myEndpoint}/${categoria.id}`)
        .send(updateCategoriaDto)
        .expect(404)
    })
  })

  describe('DELETE /categorias/:id', () => {
    it('elimina una categoria', async () => {
      mockCategoriasService.remove.mockResolvedValue(categoria)

      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${categoria.id}`)
        .expect(202)
    })

    it('lanza un error 404 si la categoria no existe', async () => {
      mockCategoriasService.removeSoft.mockRejectedValue(
        new NotFoundException(),
      )
      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${categoria.id}`)
        .expect(404)
    })
  })
})
