import {
  IsBoolean,
  IsIdentityCard,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateClienteDto {
  @ApiProperty({
    description: 'Paco',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  nombre: string
  @ApiProperty({
    description: 'Perez',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, {
    message: 'El apellidp debe tener entre 3 y 255 caracteres',
  })
  apellido: string
  @ApiProperty({
    description: 'Calle Falsa 123',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, {
    message: 'La direccion debe tener entre 3 y 255 caracteres',
  })
  direccion: string
  @ApiProperty({
    description: '28080',
    type: Number,
    required: true,
    minimum: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  codigoPostal: number
  @ApiProperty({
    description: '12345678Z',
    type: String,
    required: true,
  })
  @IsString()
  @IsIdentityCard('ES')
  @IsNotEmpty()
  dni: string
  @ApiProperty({
    description: 'imagen.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  imagen?: string
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}
