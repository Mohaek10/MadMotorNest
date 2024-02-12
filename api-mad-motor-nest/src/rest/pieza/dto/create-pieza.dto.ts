import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePiezaDto {
  @ApiProperty({
    description: 'Nombre de la pieza',
    minLength: 2,
    maxLength: 100,
    default: 'Pieza 1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100, {
    message: 'El nombre debe tener entre 2 y 100 caracteres',
  })
  nombre?: string;

  @ApiProperty({
    description: 'Descripción de la pieza',
    minLength: 2,
    maxLength: 100,
    default: 'descripcion 1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100, {
    message: 'La descripción debe tener entre 2 y 100 caracteres',
  })
  descripcion?: string;

  @ApiProperty({
    description: 'URL de la imagen de la pieza',
    minLength: 2,
    maxLength: 100,
    default: 'https://via.placeholder.com/150',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100, {
    message: 'La imagen debe ser una URL válida',
  })
  imagen?: string;

  @ApiProperty({
    description: 'Precio de la pieza',
    minimum: 0,
    default: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precio?: number;

  @ApiProperty({
    description: 'Cantidad de la pieza',
    minimum: 0,
    default:4,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @ApiProperty({
    description: 'Indica si la pieza está eliminada',
    default: false
  })
  isDeleted?: boolean;
}
