import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'

export class CreateVehiculoDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'El campo marca debe tener entre 2 y 100 caracteres',
  })
  marca: string
  @IsString()
  @IsNotEmpty()
  modelo: string
  @IsNumber()
  @Min(1900, { message: 'El campo year debe ser mayor a 1900' })
  year: number
  @IsNumber()
  @Min(0, { message: 'El campo km debe ser mayor a 0' })
  km: number
  @IsNumber()
  @Min(0)
  precio: number
  @IsNumber()
  @Min(0, { message: 'El campo stock debe ser mayor a 0' })
  stock: number
  @IsString()
  @IsOptional()
  image: string
  @IsString()
  @IsNotEmpty()
  categoria: string
}
