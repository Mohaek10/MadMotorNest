import { INestApplication, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

import { CacheModule } from '@nestjs/cache-manager'
import {ResponsePiezaDto} from "../../src/rest/pieza/dto/response-pieza.dto";
import {CreatePiezaDto} from "../../src/rest/pieza/dto/create-pieza.dto";
import {UpdatePiezaDto} from "../../src/rest/pieza/dto/update-pieza.dto";
import {PiezaController} from "../../src/rest/pieza/pieza.controller";
import {PiezaService} from "../../src/rest/pieza/pieza.service";
import {JwtAuthGuard} from "../../src/rest/auth/guards/jwt-auth.guard";
import {RolesAuthGuard} from "../../src/rest/auth/guards/roles-auth.guard";


describe('PiezaController (e2e)', () => {
    let app: INestApplication
    const myEndpoint = `/pieza`

    const piezaResponse: ResponsePiezaDto = {
        id: 'a894b317-5ca2-4952-8417-856774001b71',
        nombre:'nombre',
        descripcion: 'descripcion',
        precio: 100,
        cantidad: 10,
        imagen: 'imagen',
        isDeleted: false,
    }

    const createPiezaDto: CreatePiezaDto = {
        nombre: 'nombre',
        precio: 100,
        cantidad: 10,
        descripcion: 'descripcion',
        imagen: 'imagen',
    }

    const updatePiezaDto: UpdatePiezaDto = {
        descripcion: 'descripcion actualizada',
        isDeleted: false,
    }

    const mockPiezaService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeSoft: jest.fn(),
        exists: jest.fn(),
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CacheModule.register()],
            controllers: [PiezaController],
            providers: [
                PiezaService,
                { provide: PiezaService, useValue: mockPiezaService },
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

    describe('GET /pieza', () => {
        it('devuelve todas las piezas', async () => {
            mockPiezaService.findAll.mockResolvedValue([piezaResponse])

            const { body } = await request(app.getHttpServer())
                .get(myEndpoint)
                .expect(200)
            expect(() => {
                expect(body).toEqual([piezaResponse])
                expect(mockPiezaService.findAll).toHaveBeenCalled()
            })
        })

        it('devuelve las piezas paginadas', async () => {
            mockPiezaService.findAll.mockResolvedValue([piezaResponse])

            const { body } = await request(app.getHttpServer())
                .get(`${myEndpoint}?page=1&limit=10`)
                .expect(200)
            expect(() => {
                expect(body).toEqual([piezaResponse])
                expect(mockPiezaService.findAll).toHaveBeenCalled()
            })
        })
    })

    describe('GET /pieza/:id', () => {
        it('devuelve una pieza', async () => {
            mockPiezaService.findOne.mockResolvedValue(piezaResponse)

            const { body } = await request(app.getHttpServer())
                .get(`${myEndpoint}/${piezaResponse.id}`)
                .expect(200)
            expect(() => {
                expect(body).toEqual(piezaResponse)
                expect(mockPiezaService.findOne).toHaveBeenCalled()
            })
        })

        it('lanza excepcion si la pieza no existe', async () => {
            mockPiezaService.findOne.mockRejectedValue(new NotFoundException())

            await request(app.getHttpServer())
                .get(`${myEndpoint}/${piezaResponse.id}`)
                .expect(404)
        })
    })

    describe('POST /pieza', () => {
        it('crea una nueva pieza', async () => {
            mockPiezaService.create.mockResolvedValue(piezaResponse)

            const { body } = await request(app.getHttpServer())
                .post(myEndpoint)
                .send(createPiezaDto)
                .expect(201)
            expect(() => {
                expect(body).toEqual(piezaResponse)
                expect(mockPiezaService.create).toHaveBeenCalledWith(
                    createPiezaDto,
                )
            })
        })
    })

    describe('PUT /pieza/:id', () => {
        it('actualiza una pieza', async () => {
            mockPiezaService.update.mockResolvedValue(piezaResponse)

            const { body } = await request(app.getHttpServer())
                .put(`${myEndpoint}/${piezaResponse.id}`)
                .send(updatePiezaDto)
                .expect(200)
            expect(() => {
                expect(body).toEqual(piezaResponse)
                expect(mockPiezaService.update).toHaveBeenCalledWith(
                    piezaResponse.id,
                    updatePiezaDto,
                )
            })
        })

        it('lanza un error si la pieza no existe', async () => {
            mockPiezaService.update.mockRejectedValue(new NotFoundException())
            await request(app.getHttpServer())
                .put(`${myEndpoint}/${piezaResponse.id}`)
                .send(mockPiezaService)
                .expect(404)
        })
    })

    describe('DELETE /pieza/:id', () => {
        it('elimina una pieza', async () => {
            mockPiezaService.remove.mockResolvedValue(piezaResponse)

            await request(app.getHttpServer())
                .delete(`${myEndpoint}/${piezaResponse.id}`)
                .expect(204)
        })

        it('devuelve un error si la pieza no existe', async () => {
            mockPiezaService.removeSoft.mockRejectedValue(new NotFoundException())
            await request(app.getHttpServer())
                .delete(`${myEndpoint}/${piezaResponse.id}`)
                .expect(404)
        })
    })


})