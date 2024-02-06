import { Prop } from '@nestjs/mongoose'

export class LineaDePedido {
  @Prop({
    type: Number,
    required: false,
  })
  idVehiculo: number

  @Prop({
    type: String,
    required: false,
  })
  idPieza: string

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  cantidadVehiculo: number

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  cantidadPieza: number

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  precioVehiculo: number = 0

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  precioPieza: number = 0

  @Prop({
    type: Number,
    required: false,
  })
  precioTotal: number
}
