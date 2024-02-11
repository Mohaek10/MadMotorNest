import { PartialType } from '@nestjs/mapped-types'
import { CreateVehiculoDto } from './create-vehiculo.dto'
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateVehiculoDto extends PartialType(CreateVehiculoDto) {
  @ApiProperty({
    description: 'Marca del vehiculo',
    type: String,
    required: false,
    default: 'Toyota',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @Length(2, 100, {
    message: 'El campo marca debe tener entre 2 y 100 caracteres',
  })
  marca?: string

  @ApiProperty({
    description: 'Modelo del vehiculo',
    type: String,
    required: false,
    default: 'Corolla',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  modelo?: string

  @ApiProperty({
    description: 'Año del vehiculo',
    type: Number,
    required: false,
    default: 2021,
    minimum: 1900,
  })
  @IsNumber()
  @IsOptional()
  @Min(1900, { message: 'El campo year debe ser mayor a 1900' })
  year?: number

  @ApiProperty({
    description: 'Kilometraje del vehiculo',
    type: Number,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El campo km debe ser mayor a 0' })
  km?: number

  @ApiProperty({
    description: 'Precio del vehiculo',
    type: Number,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El campo stock debe ser mayor a 0' })
  precio?: number

  @ApiProperty({
    description: 'Stock del vehiculo',
    type: Number,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El campo stock debe ser mayor a 0' })
  stock?: number

  @ApiProperty({
    description: 'Imagen del vehiculo',
    type: String,
    required: false,
    default: 'https://via.placeholder.com/150',
  })
  @IsString()
  @IsOptional()
  image?: string

  @ApiProperty({
    description: 'Categoria del vehiculo',
    type: String,
    required: false,
    default: 'Sedan',
  })
  @IsString()
  @IsOptional()
  categoria?: string
}
