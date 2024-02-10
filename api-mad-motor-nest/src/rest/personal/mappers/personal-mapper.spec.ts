import { PersonalMapper } from './personal.mapper'
import { CreatePersonalDto } from '../dto/create-personal.dto'
import { Test, TestingModule } from '@nestjs/testing'
import { Personal } from '../entities/personal.entity'
import { ResponsePersonalDto } from '../dto/response-personal.dto'
import { UpdatePersonalDto } from '../dto/update-personal.dto'

describe('PersonalMapper', () => {
  let provider: PersonalMapper

  const createPersonalDto: CreatePersonalDto = {
    nombre: 'Juan',
    apellidos: 'Gonzalez',
    dni: '12345678P',
    telefono: '654789123',
    fechaNacimiento: '10-10-1990',
    sueldo: 1000,
    iban: 'ES1234567891234567891234',
    email: 'juangon@gmail.com',
    direccion: 'Callesita 1',
  }

  const personal = {
    id: 1,
    nombre: 'Juan',
    apellidos: 'Gonzalez',
    dni: '12345678P',
    telefono: '654789123',
    fechaNacimiento: '10-10-1990',
    sueldo: 1000,
    iban: 'ES1234567891234567891234',
    email: 'juangon@gmail.com',
    direccion: 'Callesita 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalMapper],
    }).compile()

    provider = module.get<PersonalMapper>(PersonalMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
  describe('toEntity', () => {
    it('should return a personal', () => {
      const expectedPersonal: Personal = {
        ...personal,
      }
      const actualPersonal = provider.toEntity(createPersonalDto)
      expect(actualPersonal).toBeInstanceOf(Personal)
      expect(actualPersonal.nombre).toEqual(expectedPersonal.nombre)
      expect(actualPersonal.apellidos).toEqual(expectedPersonal.apellidos)
      expect(actualPersonal.dni).toEqual(expectedPersonal.dni)
      expect(actualPersonal.telefono).toEqual(expectedPersonal.telefono)
      expect(actualPersonal.fechaNacimiento).toEqual(
        expectedPersonal.fechaNacimiento,
      )
      expect(actualPersonal.sueldo).toEqual(expectedPersonal.sueldo)
      expect(actualPersonal.iban).toEqual(expectedPersonal.iban)
      expect(actualPersonal.email).toEqual(expectedPersonal.email)
      expect(actualPersonal.direccion).toEqual(expectedPersonal.direccion)
    })
  })
  describe('toResponseDto', () => {
    it('should return a responsePersonalDto', () => {
      const expectedResponsePersonalDto = {
        ...personal,
      }
      const actualResponsePersonalDto = provider.toResponseDto(personal)
      expect(actualResponsePersonalDto).toBeInstanceOf(ResponsePersonalDto)
      expect(actualResponsePersonalDto.nombre).toEqual(
        expectedResponsePersonalDto.nombre,
      )
      expect(actualResponsePersonalDto.apellidos).toEqual(
        expectedResponsePersonalDto.apellidos,
      )
      expect(actualResponsePersonalDto.dni).toEqual(
        expectedResponsePersonalDto.dni,
      )
      expect(actualResponsePersonalDto.telefono).toEqual(
        expectedResponsePersonalDto.telefono,
      )
      expect(actualResponsePersonalDto.fechaNacimiento).toEqual(
        expectedResponsePersonalDto.fechaNacimiento,
      )
      expect(actualResponsePersonalDto.sueldo).toEqual(
        expectedResponsePersonalDto.sueldo,
      )
      expect(actualResponsePersonalDto.iban).toEqual(
        expectedResponsePersonalDto.iban,
      )
      expect(actualResponsePersonalDto.email).toEqual(
        expectedResponsePersonalDto.email,
      )
      expect(actualResponsePersonalDto.direccion).toEqual(
        expectedResponsePersonalDto.direccion,
      )
    })
  })
  describe('toUpdateDto', () => {
    it('should return a personal', () => {
      const updatePersonalDto: UpdatePersonalDto = {
        direccion: 'Calle Mayor, 1',
        telefono: '123456789',
        email: 'juangon@gmail.com',
        sueldo: 2000,
        iban: 'ES0621000418401234567891',
      }
      const expectedPersonal: Personal = {
        ...personal,
        ...updatePersonalDto,
      }
      const actualPersonal = provider.toUpdateDto(updatePersonalDto, personal)

      expect(actualPersonal).toBeInstanceOf(Personal)
      expect(actualPersonal.direccion).toEqual(expectedPersonal.direccion)
      expect(actualPersonal.telefono).toEqual(expectedPersonal.telefono)
      expect(actualPersonal.email).toEqual(expectedPersonal.email)
      expect(actualPersonal.sueldo).toEqual(expectedPersonal.sueldo)
      expect(actualPersonal.iban).toEqual(expectedPersonal.iban)
    })
  })
})
