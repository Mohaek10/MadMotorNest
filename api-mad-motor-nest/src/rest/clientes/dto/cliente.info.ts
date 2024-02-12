import { ApiProperty } from '@nestjs/swagger'

export class ClienteInfo {
  @ApiProperty({
    example: '1',
    type: Number,
    required: true,
    description: 'Id del cliente',
  })
  id: number
  @ApiProperty({
    example: 'Paco',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
    description: 'Nombre del cliente',
  })
  nombre: string
  @ApiProperty({
    example: 'Perez',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
    description: 'Apellido del cliente',
  })
  apellido: string
  @ApiProperty({
    example: 'Calle Falsa 123',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
    description: 'Direccion del cliente',
  })
  direccion: string
  @ApiProperty({
    example: '28080',
    type: Number,
    required: true,
    minimum: 10000,
    description: 'Codigo postal del cliente',
  })
  codigoPostal: number
  @ApiProperty({
    example: '12345678Z',
    type: String,
    required: true,
    description: 'DNI del cliente ',
  })
  dni: string
  @ApiProperty({
    example: 'imagen.jpg',
    type: String,
    required: true,
    description: 'Imagen del cliente',
  })
  imagen: string
  @ApiProperty({
    example: 'false',
    type: Boolean,
    required: true,
    description: 'Indica si el cliente ha sido eliminado',
  })
  isDeleted: boolean
  @ApiProperty({
    example: '2021-07-06T13:14:00.000Z',
    type: Date,
    required: true,
    description: 'Fecha de creacion del cliente',
  })
  createdAt: Date
  @ApiProperty({
    example: '2021-07-06T13:14:00.000Z',
    type: Date,
    required: true,
    description: 'Fecha de actualizacion del cliente',
  })
  updatedAt: Date
}
