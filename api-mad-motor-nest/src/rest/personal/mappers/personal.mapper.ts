import { Injectable } from '@nestjs/common'
import { CreatePersonalDto } from '../dto/create-personal.dto'
import { Personal } from '../entities/personal.entity'
import { plainToClass } from 'class-transformer'
import { ResponsePersonalDto } from '../dto/response-personal.dto'
import { UpdatePersonalDto } from '../dto/update-personal.dto'

@Injectable()
export class PersonalMapper {
  toEntity(createPersonalDto: CreatePersonalDto): Personal {
    const personal = plainToClass(Personal, createPersonalDto)
    return personal
  }

  toResponseDto(personal: Personal): ResponsePersonalDto {
    const responsePersonalDto = plainToClass(ResponsePersonalDto, personal)
    return responsePersonalDto
  }
  toUpdateDto(
    updatePersonalDto: UpdatePersonalDto,
    personal: Personal,
  ): Personal {
    const personalUpdateDto = { ...personal, ...updatePersonalDto }
    return personalUpdateDto
  }
}
