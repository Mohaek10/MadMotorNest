import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class DireccionDto {
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  calle: string

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  numero: string

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  ciudad: string

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  provincia: string

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  pais: string

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  codigoPostal: string
}
