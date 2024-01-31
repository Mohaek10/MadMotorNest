import { PartialType } from '@nestjs/mapped-types'
import { CreateCategoriaDto } from './create-categoria.dto'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, {
    message: 'El nombre de la categoria debe tener entre 3 y 100 caracteres.',
  })
  nombre?: string

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean
}
