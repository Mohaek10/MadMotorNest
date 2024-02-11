import { ApiProperty } from '@nestjs/swagger'

export class ResponseVehiculoDto {
  @ApiProperty({
    example: 1,
    description: 'Id del vehiculo',
  })
  id: number
  @ApiProperty({
    example: 'Toyota',
    description: 'Marca del vehiculo',
  })
  marca: string

  @ApiProperty({
    example: 'Corolla',
    description: 'Modelo del vehiculo',
  })
  modelo: string
  @ApiProperty({
    example: 2021,
    description: 'Año del vehiculo',
  })
  year: number
  @ApiProperty({
    example: 0,
    description: 'Kilometraje del vehiculo',
  })
  km: number
  @ApiProperty({
    example: 100000,
    description: 'Precio del vehiculo',
  })
  precio: number
  @ApiProperty({
    example: 1,
    description: 'Stock del vehiculo',
  })
  stock: number
  @ApiProperty({
    example: 'https://www.google.com',
    description: 'Imagen del vehiculo',
  })
  image: string
  @ApiProperty({
    example: '2023-07-30T16:00:00.000Z',
    description: 'Fecha de creacion del vehiculo',
  })
  createdAt: Date
  @ApiProperty({
    example: '2023-07-30T16:00:00.000Z',
    description: 'Fecha de actualizacion del vehiculo',
  })
  updateAt: Date
  @ApiProperty({
    example: false,
    description: 'Indica si el vehiculo ha sido eliminado',
  })
  isDeleted: boolean
  @ApiProperty({
    example: 'Sedan',
    description: 'Categoria del vehiculo',
  })
  categoria: string
}
