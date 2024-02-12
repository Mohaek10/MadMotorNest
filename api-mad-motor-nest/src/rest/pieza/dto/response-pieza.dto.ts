import { ApiProperty } from '@nestjs/swagger';

export class ResponsePiezaDto {
  @ApiProperty({ description: 'ID de la pieza', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Nombre de la pieza' })
  nombre: string;

  @ApiProperty({ description: 'Descripción de la pieza' })
  descripcion: string;

  @ApiProperty({ description: 'URL de la imagen de la pieza' })
  imagen: string;

  @ApiProperty({ description: 'Precio de la pieza' })
  precio: number;

  @ApiProperty({ description: 'Cantidad de la pieza' })
  cantidad: number;

  @ApiProperty({ description: 'Indica si la pieza está eliminada' })
  isDeleted: boolean;
}
