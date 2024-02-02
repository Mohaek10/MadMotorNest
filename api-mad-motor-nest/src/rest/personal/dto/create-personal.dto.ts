import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'

export class CreatePersonalDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del personal',
    format: 'string',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  nombre: string

  @ApiProperty({
    example: 'Perez Dominguez',
    description: 'Apellido del personal',
    format: 'string',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'Los apellidos debe tener entre 2 y 100 caracteres',
  })
  apellidos: string

  @ApiProperty({
    example: '12345678Z',
    description: 'DNI del personal',
    format: 'string',
    minLength: 9,
    maxLength: 9,
  })
  dni: string

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento del personal',
    format: 'date',
  })
  @IsDate()
  @IsNotEmpty()
  fechaNacimiento: Date

  @ApiProperty({
    example: 'https://i.imgur.com/RboPIU6.png',
    description: 'Imagen del personal',
  })
  @IsNotEmpty()
  imagen: string

  @ApiProperty({
    example: 'Calle de la piruleta, 1',
    description: 'Direccion del personal',
    format: 'string',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200, {
    message: 'La direccion debe tener entre 2 y 200 caracteres',
  })
  direccion: string

  @ApiProperty({
    example: '666666666',
    description: 'Telefono del personal',
    format: 'string',
    minLength: 9,
    maxLength: 12,
  })
  @IsString()
  @IsNotEmpty()
  @Length(9, 12, {
    message: 'El telefono debe tener entre 9 y 12 caracteres',
  })
  telefono: string

  @ApiProperty({
    example: 'juanperez@gmail.com',
    description: 'Email del personal',
    format: 'string',
  })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    example: '1000.0',
    description: 'Sueldo del personal',
    format: 'double precision',
  })
  @IsNumber()
  @IsNotEmpty()
  sueldo: number

  @ApiProperty({
    example: 'ES6621000418401234567891',
    description: 'IBAN del personal',
    format: 'string',
    minLength: 20,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(20, 20, {
    message: 'El IBAN debe tener 20 caracteres',
  })
  iban: string
}
