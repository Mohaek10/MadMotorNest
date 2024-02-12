import { PartialType } from '@nestjs/mapped-types'
import { CreateClienteDto } from './create-cliente.dto'
import {
  IsBoolean,
  IsOptional,
  IsPostalCode,
  IsString,
  Length,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiProperty({
    example: 'Paco',
    type: String,
    description: 'Nombre del cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  nombre: string
  @ApiProperty({
    example: 'Perez',
    type: String,
    description: 'Apellido del cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  apellido: string
  @ApiProperty({
    example: 'Calle Falsa 123',
    type: String,
    description: 'Direccion del cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  direccion: string
  @ApiProperty({
    example: '28080',
    type: Number,
    description: 'Codigo postal del cliente',
    required: false,
  })
  @IsOptional()
  @IsPostalCode('ES')
  codigoPostal: number
  @ApiProperty({
    example: 'imagen.jpg',
    type: String,
    description: 'Imagen del cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  imagen: string
  @ApiProperty({
    example: 'false',
    type: Boolean,
    description: 'Indica si el cliente ha sido eliminado',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted: boolean
}
