import { IsNumber, IsOptional, IsUUID, Min, ValidateIf } from 'class-validator'

export class LineaDePedidoDto {
  @IsOptional()
  @IsNumber()
  idVehiculo?: number

  @ValidateIf((o) => o.idVehiculo === undefined) // Validar solo si idVehiculo no está definido
  @IsUUID()
  idPieza?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idVehiculo !== undefined) // Validar solo si idVehiculo está definido
  cantidadVehiculo?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idPieza !== undefined) // Validar solo si idPieza está definido
  cantidadPieza?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idPieza !== undefined) // Validar solo si idPieza está definido
  precioPieza?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.idVehiculo !== undefined) // Validar solo si idVehiculo está definido
  precioVehiculo?: number

  @IsNumber()
  @Min(0)
  precioTotal: number
}
