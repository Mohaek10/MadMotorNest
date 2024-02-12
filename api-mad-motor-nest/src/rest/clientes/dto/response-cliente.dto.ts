import { ApiProperty } from '@nestjs/swagger'

export class ResponseClienteDto {
  @ApiProperty({
    example: '1',
    type: Number,
    description: 'Id del cliente',
  })
  id: number
  @ApiProperty({
    example: 'Paco',
    type: String,
    description: 'Nombre del cliente',
  })
  nombre: string
  @ApiProperty({
    example: 'Perez',
    type: String,
    description: 'Apellido del cliente',
  })
  apellido: string
  @ApiProperty({
    example: 'Calle Falsa 123',
    type: String,
    description: 'Direccion del cliente',
  })
  direccion: string
  @ApiProperty({
    example: '28080',
    type: Number,
    description: 'Codigo postal del cliente',
  })
  codigoPostal: number
  @ApiProperty({
    example: '12345678Z',
    type: String,
    description: 'DNI del cliente',
  })
  dni: string
  @ApiProperty({
    example: 'imagen.jpg',
    type: String,
    description: 'Imagen del cliente',
  })
  imagen: string
  @ApiProperty({
    example: 'false',
    type: Boolean,
    description: 'Indica si el cliente ha sido eliminado',
  })
  isDeleted: boolean
  @ApiProperty({
    example: '2021-07-06T13:14:00.000Z',
    type: Date,
    description: 'Fecha de creacion del cliente',
  })
  createdAt: Date
  @ApiProperty({
    example: '2021-07-06T13:14:00.000Z',
    type: Date,
    description: 'Fecha de actualizacion del cliente',
  })
  updatedAt: Date
}
