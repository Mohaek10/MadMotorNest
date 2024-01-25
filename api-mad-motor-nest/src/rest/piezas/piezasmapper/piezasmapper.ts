import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Pieza } from '../entities/pieza.entity'
import { CreatePiezaDto } from '../dto/create-pieza.dto'
import { ResponsePiezaDto } from '../dto/response-pieza.dto'

@Injectable()
export class Piezasmapper {
  toPiezaFromCreate(createFunkoDto: CreatePiezaDto): Pieza {
    const funko = plainToClass(Pieza, createFunkoDto)
    return funko
  }

  toFunkoFromUpdate(
    updatePiezaDto: CreatePiezaDto,
    existingPieza: Pieza,
  ): Pieza {
    const pieza = plainToClass(Pieza, updatePiezaDto)
    return { ...existingPieza, ...pieza }
  }

  toResponseDto(pieza: Pieza): ResponsePiezaDto {
    const dto = plainToClass(ResponsePiezaDto, pieza)
    return dto
  }
}
