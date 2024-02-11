import { PartialType } from '@nestjs/mapped-types'
import { CreatePersonalDto } from './create-personal.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePersonalDto extends PartialType(CreatePersonalDto) {
  @ApiProperty({
    example: 'Calle Mayor, 1',
    description: 'Direccion del personal',
    format: 'string',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  direccion?: string

  @ApiProperty({
    example: '123456789',
    description: 'Telefono del personal',
    format: 'string',
    minLength: 9,
    maxLength: 12,
  })
  @IsOptional()
  @IsString()
  telefono?: string

  @ApiProperty({
    example: 'juanitoperez@gmail.com',
    description: 'Email del personal',
    format: 'string',
  })
  @IsOptional()
  @IsString()
  email?: string

  @ApiProperty({
    example: '2000.0',
    description: 'Sueldo del personal',
    format: 'double precision',
  })
  @IsOptional()
  @IsNumber()
  sueldo?: number

  @ApiProperty({
    example: 'ES0621000418401234567891',
    description: 'IBAN del personal',
    format: 'string',
    minLength: 20,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  iban?: string
}
