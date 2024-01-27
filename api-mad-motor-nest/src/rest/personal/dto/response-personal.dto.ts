import { ApiProperty } from '@nestjs/swagger'

export class ResponsePersonalDto {
    @ApiProperty({example: 1, description: 'Identificador del personal'})
  id: number
    @ApiProperty({example: 'Juan', description: 'Nombre del personal'})
  nombre: string
    @ApiProperty({example: 'Perez Dominguez', description: 'Apellidos del personal'})
    apellidos: string
  @ApiProperty({ example: '12345678Z', description: 'DNI del personal' })
  dni: string
    @ApiProperty({example: '01-01-1999', description: 'Fecha de nacimiento del personal'})
  fechaNacimiento: Date
  @ApiProperty({
    example: 'https://i.imgur.com/RboPIU6.png',
    description: 'Imagen del personal',
  })
  imagen: string
    @ApiProperty({example: 'Calle de la piruleta, 1', description: 'Direccion del personal'})
  direccion: string
    @ApiProperty({example: '123456789', description: 'Telefono del personal'})
  telefono: string
    @ApiProperty({example: 'juanperez@gmail.com', description: 'Email del personal'})
  email: string
    @ApiProperty({example: '2000.0', description: 'Sueldo del personal'})
  sueldo: number
    @ApiProperty({example: 'ES0621000418401234567891', description: 'IBAN del personal'})
  iban: string
}
