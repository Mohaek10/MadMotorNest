import { Test, TestingModule } from '@nestjs/testing'
import { VehiculoMapper } from './vehiculo-mapper'
import { Categoria } from '../../categorias/entities/categoria.entity'
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto'
import { Vehiculo } from '../entities/vehiculo.entity'
import { UpdateVehiculoDto } from '../dto/update-vehiculo.dto'
import { ResponseVehiculoDto } from '../dto/response-vehiculo.dto'

describe('VehiculoMapper', () => {
  let provider: VehiculoMapper

  const categoria: Categoria = {
    id: '9f56c31a-a0e8-4536-86e5-acf642b69b28',
    nombre: 'categoria',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    vehiculos: [],
  }
  const createVehiculoDto: CreateVehiculoDto = {
    marca: 'marca',
    modelo: 'modelo',
    year: 2021,
    km: 0,
    precio: 0,
    stock: 0,
    image: 'image',
    categoria: 'categoria',
  }
  const vehiculo = {
    id: 1,
    marca: 'marca',
    modelo: 'modelo',
    year: 2021,
    km: 0,
    precio: 0,
    stock: 0,
    image: 'image',
    categoria,
    createdAt: new Date(),
    updateAt: new Date(),
    isDeleted: false,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiculoMapper],
    }).compile()

    provider = module.get<VehiculoMapper>(VehiculoMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
  describe('toVehiculo', () => {
    it('should return a vehiculo', () => {
      const expectedVehiculo: Vehiculo = {
        ...vehiculo,
        categoria: categoria,
      }
      const actualVehiculo = provider.toVehiculo(createVehiculoDto, categoria)
      expect(actualVehiculo).toBeInstanceOf(Vehiculo)
      expect(actualVehiculo.marca).toEqual(expectedVehiculo.marca)
      expect(actualVehiculo.modelo).toEqual(expectedVehiculo.modelo)
      expect(actualVehiculo.year).toEqual(expectedVehiculo.year)
      expect(actualVehiculo.km).toEqual(expectedVehiculo.km)
      expect(actualVehiculo.precio).toEqual(expectedVehiculo.precio)
      expect(actualVehiculo.stock).toEqual(expectedVehiculo.stock)
      expect(actualVehiculo.image).toEqual(expectedVehiculo.image)
      expect(actualVehiculo.categoria).toEqual(expectedVehiculo.categoria)
    })
  })
  describe('toVehiculoFromUpdate', () => {
    it('should return a vehiculo', () => {
      const dto: UpdateVehiculoDto = {
        marca: 'marca',
      }
      const expectedVehiculo: Vehiculo = {
        ...vehiculo,
        marca: dto.marca,
        categoria: categoria,
      }
      const actualVehiculo = provider.toVehiculoFromUpdate(
        vehiculo,
        dto,
        categoria,
      )
      expect(actualVehiculo).toBeInstanceOf(Vehiculo)
      expect(actualVehiculo.marca).toEqual(expectedVehiculo.marca)
    })
  })
  describe('toResponseVehiculoDto', () => {
    it('should return a response vehiculo dto', () => {
      const expectedResponseVehiculoDto: ResponseVehiculoDto = {
        ...vehiculo,
        categoria: categoria.nombre,
      }
      const actualResponseVehiculoDto = provider.toResponseVehiculoDto(vehiculo)
      expect(actualResponseVehiculoDto).toBeInstanceOf(ResponseVehiculoDto)
      expect(actualResponseVehiculoDto.marca).toEqual(
        expectedResponseVehiculoDto.marca,
      )
      expect(actualResponseVehiculoDto.modelo).toEqual(
        expectedResponseVehiculoDto.modelo,
      )
      expect(actualResponseVehiculoDto.year).toEqual(
        expectedResponseVehiculoDto.year,
      )
    })
  })
})
