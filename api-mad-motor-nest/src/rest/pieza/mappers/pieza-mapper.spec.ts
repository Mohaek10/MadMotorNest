import { CreatePiezaDto } from '../dto/create-pieza.dto'
import { Pieza } from '../entities/pieza.entity'
import { ResponsePiezaDto } from '../dto/response-pieza.dto'
import { PiezaMapper } from './pieza-mapper'

describe('PiezaMapper', () => {
  let mapper: PiezaMapper

  beforeEach(() => {
    mapper = new PiezaMapper()
  })

  describe('toPiezaFromCreate', () => {
    it('should map CreatePiezaDto to Pieza entity', () => {
      const createDto: CreatePiezaDto = {
        nombre: 'Pieza de prueba',
        descripcion: 'Descripción de prueba',
        precio: 10,
        cantidad: 5,
      }

      const result = mapper.toPiezaFromCreate(createDto)

      expect(result).toBeInstanceOf(Pieza)
      expect(result.nombre).toBe(createDto.nombre)
      expect(result.descripcion).toBe(createDto.descripcion)
      expect(result.precio).toBe(createDto.precio)
      expect(result.cantidad).toBe(createDto.cantidad)
    })
  })

  describe('toPiezaFromUpdate', () => {
    it('should map UpdatePiezaDto to existing Pieza entity', () => {
      const existingPieza: Pieza = {
        id: '1',
        nombre: 'Pieza existente',
        descripcion: 'Descripción existente',
        precio: 20,
        cantidad: 8,
        imagen: 'Im',
        isDeleted: false,
      }

      const updateDto: CreatePiezaDto = {
        nombre: 'Pieza actualizada',
        descripcion: 'Descripción actualizada',
        precio: 15,
        cantidad: 3,
      }

      const result = mapper.toPiezaFromUpdate(updateDto, existingPieza)

      expect(result).toEqual({
        id: '1',
        nombre: 'Pieza actualizada',
        descripcion: 'Descripción actualizada',
        precio: 15,
        cantidad: 3,
        imagen: 'Im',
        isDeleted: false,
      })
    })
  })

  describe('toResponseDto', () => {
    it('should map Pieza entity to ResponsePiezaDto', () => {
      const pieza: Pieza = {
        id: '1',
        nombre: 'Pieza de prueba',
        descripcion: 'Descripción de prueba',
        precio: 10,
        cantidad: 5,
        imagen: 'Im',
        isDeleted: false,
      }

      const result = mapper.toResponseDto(pieza)

      expect(result).toBeInstanceOf(ResponsePiezaDto)
      expect(result.id).toBe(pieza.id)
      expect(result.nombre).toBe(pieza.nombre)
      expect(result.descripcion).toBe(pieza.descripcion)
      expect(result.precio).toBe(pieza.precio)
      expect(result.cantidad).toBe(pieza.cantidad)
    })
  })
})
