import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePiezaDto } from './create-pieza.dto';

export class UpdatePiezaDto extends PartialType(CreatePiezaDto) {
  @ApiProperty({
    description: 'Nombre de la pieza',
    minLength: 2,
    maxLength: 100,
    default: 'Pieza 1',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100, {
    message: 'El campo marca debe tener entre 2 y 100 caracteres',
  })
  nombre?: string;

  @ApiProperty({
    description: 'Descripción de la pieza',
    minLength: 2,
    maxLength: 100,
    default: 'descripcion 1',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100, {
    message: 'El campo descripcion debe tener entre 2 y 100 caracteres',
  })
  descripcion?: string;

  @ApiProperty({
    description: 'URL de la imagen de la pieza',
    minLength: 2,
    maxLength: 100,
    default: 'https://via.placeholder.com/150',
  })
  @IsOptional()
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
  @IsOptional()
  @IsNumber()
  @Min(0, {
    message: 'El campo precio debe ser mayor a 0',
  })
  precio?: number;

  @ApiProperty({
    description: 'Cantidad de la pieza',
    minimum: 0,
    default:4,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    message: 'El campo cantidad debe ser mayor a 0',

  })
  cantidad?: number;
}
