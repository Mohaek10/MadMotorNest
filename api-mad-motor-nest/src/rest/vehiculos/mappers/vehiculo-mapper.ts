import { Injectable } from '@nestjs/common'
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto'
import { Categoria } from '../../categorias/entities/categoria.entity'
import { plainToClass } from 'class-transformer'
import { Vehiculo } from '../entities/vehiculo.entity'
import { ResponseVehiculoDto } from '../dto/response-vehiculo.dto'

@Injectable()
export class VehiculoMapper {
  toVehiculo(
    createVehiculoDto: CreateVehiculoDto,
    categoria: Categoria,
  ): Vehiculo {
    const vehiculo = plainToClass(Vehiculo, createVehiculoDto)
    vehiculo.categoria = categoria
    return vehiculo
  }

  toResponseVehiculoDto(vehiculo: Vehiculo): ResponseVehiculoDto {
    const res = plainToClass(ResponseVehiculoDto, vehiculo)
    if (vehiculo.categoria && vehiculo.categoria.nombre) {
      res.categoria = vehiculo.categoria.nombre
    } else {
      res.categoria = 'Sin categoria'
    }
    return res
  }
}
