import { DireccionDto } from './create-direccion.dto'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class ClienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(100)
  nombre: string

  @IsString()
  @IsNotEmpty()
  @Length(100)
  apellido: string

  @IsString()
  @IsNotEmpty()
  @Length(100)
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(100)
  telefono: string

  @IsNotEmpty()
  direccion: DireccionDto
}
