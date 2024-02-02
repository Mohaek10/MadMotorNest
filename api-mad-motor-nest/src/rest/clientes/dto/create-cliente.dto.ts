import {
  IsBoolean,
  IsIdentityCard,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  nombre: string
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, {
    message: 'El apellidp debe tener entre 3 y 255 caracteres',
  })
  apellido: string
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(3, 255, {
    message: 'La direccion debe tener entre 3 y 255 caracteres',
  })
  direccion: string
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  codigoPostal: number
  @IsString()
  @IsIdentityCard('ES')
  @IsNotEmpty()
  dni: string
  @IsOptional()
  imagen?: string
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}
