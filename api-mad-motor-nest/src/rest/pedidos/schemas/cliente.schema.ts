import { Prop } from '@nestjs/mongoose'
import { Direccion } from './direccion.schema'

export class Cliente {
  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  nombre: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  apellido: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  email: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  telefono: string

  @Prop({
    type: Direccion,
    required: true,
    default: '',
  })
  direccion: Direccion
}
