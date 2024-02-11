import { ApiProperty } from '@nestjs/swagger'
import { DireccionDto } from './create-direccion.dto'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class ClienteDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(100)
  nombre: string

  @ApiProperty({
    description: 'Apellido del cliente',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(100)
  apellido: string

  @ApiProperty({
    description: 'Email del cliente',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(100)
  email: string

  @ApiProperty({
    description: 'Telefono del cliente',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(100)
  telefono: string

  @ApiProperty({
    description: 'Direccion del cliente',
    type: DireccionDto,
    required: true,
  })
  @IsNotEmpty()
  direccion: DireccionDto
}
