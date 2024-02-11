import { IsNumber, IsOptional, IsUUID, Min, ValidateIf } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LineaDePedidoDto {
  @ApiProperty({
    description: 'Id del vehículo',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  idVehiculo?: number

  @ApiProperty({
    description: 'Id de la pieza',
    type: String,
    required: false,
  })
  @ValidateIf((o) => o.idVehiculo === undefined) // Validar solo si idVehiculo no está definido
  @IsUUID()
  idPieza?: string

  @ApiProperty({
    description: 'Cantidad de vehículos',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idVehiculo !== undefined) // Validar solo si idVehiculo está definido
  cantidadVehiculo?: number

  @ApiProperty({
    description: 'Cantidad de piezas',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idPieza !== undefined) // Validar solo si idPieza está definido
  cantidadPieza?: number

  @ApiProperty({
    description: 'Precio de la pieza',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idPieza !== undefined) // Validar solo si idPieza está definido
  precioPieza?: number

  @ApiProperty({
    description: 'Precio del vehículo',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idVehiculo !== undefined) // Validar solo si idVehiculo está definido
  precioVehiculo?: number

  @ApiProperty({
    description: 'Precio total',
    type: Number,
    required: true,
  })
  @IsNumber()
  @Min(0)
  precioTotal: number
}
