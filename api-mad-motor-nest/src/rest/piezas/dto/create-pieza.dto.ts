import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreatePiezaDto {
  @IsString({ message: 'El nombre debe ser una string' })
  @IsNotEmpty({ message: 'El nombre es obigatorio' })
  @Transform(({ value }) => value.trim())
  nombre: string
  @Min(0, { message: 'El precio debe ser mayor a 0' })
  @IsNumber({}, { message: 'El precio debe ser un numero' })
  @IsNotEmpty({ message: 'El precio es requerido' })
  precio: number
  @IsNumber({}, { message: 'Cantidad tiene que ser un numeros' })
  @IsNotEmpty({ message: 'Cantidad es requerida' })
  @Min(0, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number
}
