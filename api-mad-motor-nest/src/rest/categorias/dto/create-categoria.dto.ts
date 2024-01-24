import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, {
    message: 'El nombre de la categoria debe tener entre 2 y 100 caracteres.',
  })
  nombre: string
}
