import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateVehiculoDto {
  @ApiProperty({
    description: 'Marca del vehiculo',
    type: String,
    required: true,
    default: 'Toyota',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'El campo marca debe tener entre 2 y 100 caracteres',
  })
  marca: string
  @ApiProperty({
    description: 'Modelo del vehiculo',
    type: String,
    required: true,
    default: 'Corolla',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  modelo: string
  @ApiProperty({
    description: 'Año del vehiculo',
    type: Number,
    required: true,
    default: 2021,
    minimum: 1900,
  })
  @IsNumber()
  @Min(1900, { message: 'El campo year debe ser mayor a 1900' })
  year: number
  @ApiProperty({
    description: 'Kilometraje del vehiculo',
    type: Number,
    required: true,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El campo km debe ser mayor a 0' })
  km: number
  @ApiProperty({
    description: 'Precio del vehiculo',
    type: Number,
    required: true,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  precio: number
  @ApiProperty({
    description: 'Stock del vehiculo',
    type: Number,
    required: true,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El campo stock debe ser mayor a 0' })
  stock: number
  @ApiProperty({
    description: 'Imagen del vehiculo',
    type: String,
    required: false,
    default: 'https://via.placeholder.com/150',
  })
  @IsString()
  @IsOptional()
  image: string
  @ApiProperty({
    description: 'Categoria del vehiculo',
    type: String,
    required: true,
    default: 'Sedan',
  })
  @IsString()
  @IsNotEmpty()
  categoria: string
}
