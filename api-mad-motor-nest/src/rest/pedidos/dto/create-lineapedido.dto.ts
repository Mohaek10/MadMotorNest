import { IsNumber, IsUUID, Min } from 'class-validator'

export class LineaDePedidoDto {
  @IsNumber()
  idVehiculo: number

  @IsUUID()
  idPieza: string

  @IsNumber()
  @Min(0)
  cantidadVehiculo: number

  @IsNumber()
  @Min(0)
  cantidadPieza: number

  @IsNumber()
  @Min(0)
  precioVehiculo: number

  @IsNumber()
  @Min(0)
  precioPieza: number

  @IsNumber()
  @Min(0)
  precioTotal: number
}
