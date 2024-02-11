import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DireccionDto {
  @ApiProperty({
    description: 'Calle de la dirección',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  calle: string

  @ApiProperty({
    description: 'Número de la dirección',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  numero: string

  @ApiProperty({
    description: 'Ciudad de la dirección',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  ciudad: string

  @ApiProperty({
    description: 'Provincia de la dirección',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  provincia: string

  @ApiProperty({
    description: 'País de la dirección',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  pais: string

  @ApiProperty({
    description: 'Código postal de la dirección',
    type: String,
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  codigoPostal: string
}
