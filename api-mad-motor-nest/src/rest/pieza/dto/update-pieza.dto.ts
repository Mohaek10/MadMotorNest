import { PartialType } from '@nestjs/mapped-types'
import { CreatePiezaDto } from './create-pieza.dto'
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator'

export class UpdatePiezaDto extends PartialType(CreatePiezaDto) {
  @IsOptional()
  @IsString()
  @Length(2, 100, {
    message: 'El campo marca debe tener entre 2 y 100 caracteres',
  })
  nombre?: string
  @IsOptional()
  @IsString()
  @Length(2, 100, {
    message: 'El campo descripcion debe tener entre 2 y 100 caracteres',
  })
  descripcion?: string
  @IsOptional()
  @IsString()
  @Length(2, 100, {
    message: 'La imagen debe ser una url valida',
  })
  imagen?: string
  @IsOptional()
  @IsNumber()
  @Min(0, {
    message: 'El campo precio debe ser mayor a 0',
  })
  precio?: number
  @IsOptional()
  @IsNumber()
  @Min(0, {
    message: 'El campo cantidad debe ser mayor a 0',
  })
  cantidad?: number
}
