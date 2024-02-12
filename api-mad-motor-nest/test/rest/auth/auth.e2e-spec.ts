import { BadRequestException, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { CacheModule } from '@nestjs/cache-manager'
import * as request from 'supertest'
import { UserSignUpDto } from '../../../src/rest/auth/dto/user-sign.up.dto'
import { UserSignInDto } from '../../../src/rest/auth/dto/user-sign.in.dto'
import { AuthController } from '../../../src/rest/auth/auth.controller'
import { AuthService } from '../../../src/rest/auth/auth.service'
describe('AuthController (e2e)', () => {
  let app: INestApplication
  const myEndpoint = '/auth'
  const userSignUpDto: UserSignUpDto = {
    nombre: 'nombre',
    apellidos: 'apellidos',
    username: 'username',
    email: 'email@gmail.com',
    password: 'Password1',
  }
  const userSignInDto: UserSignInDto = {
    username: 'username',
    password: 'Password1',
  }
  const mockAuth = {
    singUp: jest.fn(),
    singIn: jest.fn(),
    validateUser: jest.fn(),
    getAccessToken: jest.fn(),
  }
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [AuthController],
      providers: [AuthService, { provide: AuthService, useValue: mockAuth }],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })
  afterAll(async () => {
    await app.close()
  })
  describe('singUp', () => {
    it('should return a token', () => {
      mockAuth.singUp.mockReturnValue('token')
      return request(app.getHttpServer())
        .post(`${myEndpoint}/signup`)
        .send(userSignUpDto)
        .expect(201)
        .expect('token')
    })
    it('should return a BadRequestException', () => {
      mockAuth.singUp.mockRejectedValue(new BadRequestException())
      return request(app.getHttpServer())
        .post(`${myEndpoint}/signup`)
        .send(userSignUpDto)
        .expect(400)
    })
  })
  describe('singIn', () => {
    it('should return a token', () => {
      mockAuth.singIn.mockReturnValue('token')
      return request(app.getHttpServer())
        .post(`${myEndpoint}/signin`)
        .send(userSignInDto)
        .expect(201)
        .expect('token')
    })
    it('should return a BadRequestException', () => {
      mockAuth.singIn.mockRejectedValue(new BadRequestException())
      return request(app.getHttpServer())
        .post(`${myEndpoint}/signin`)
        .send(userSignInDto)
        .expect(400)
    })
  })
})
