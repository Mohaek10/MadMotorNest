import { PartialType } from '@nestjs/mapped-types'
import { CreateVehiculoDto } from './create-vehiculo.dto'
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator'

export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {
  @IsString()
  @IsOptional()
  @Length(2, 100, {
    message: 'El campo marca debe tener entre 2 y 100 caracteres',
  })
  marca?: string

  @IsString()
  @IsOptional()
  modelo?: string

  @IsNumber()
  @IsOptional()
  @Min(1900, { message: 'El campo year debe ser mayor a 1900' })
  year?: number

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El campo km debe ser mayor a 0' })
  km?: number

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El campo stock debe ser mayor a 0' })
  precio?: number

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El campo stock debe ser mayor a 0' })
  stock?: number

  @IsString()
  @IsOptional()
  image?: string

  @IsString()
  @IsOptional()
  categoria?: string
}
