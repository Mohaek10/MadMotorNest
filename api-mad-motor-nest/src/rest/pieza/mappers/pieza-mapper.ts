import { Injectable } from '@nestjs/common'
import { CreatePiezaDto } from '../dto/create-pieza.dto'
import { Pieza } from '../entities/pieza.entity'
import { plainToClass } from 'class-transformer'
import { ResponsePiezaDto } from '../dto/response-pieza.dto'
@Injectable()
export class PiezaMapper {
  toPiezaFromCreate(createPiezaDto: CreatePiezaDto): Pieza {
    const funko = plainToClass(Pieza, createPiezaDto)
    return funko
  }

  toPiezaFromUpdate(
    updatePiezaDto: CreatePiezaDto,
    existingPieza: Pieza,
  ): Pieza {
    const funko = plainToClass(Pieza, updatePiezaDto)
    return { ...existingPieza, ...funko }
  }

  toResponseDto(funko: Pieza): ResponsePiezaDto {
    const dto = plainToClass(ResponsePiezaDto, funko)

    return dto
  }
}
