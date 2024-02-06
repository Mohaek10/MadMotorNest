import { Prop } from '@nestjs/mongoose'

export class Direccion {
  @Prop({
    type: String,
    required: true,
    lenght: 100,
    default: '',
  })
  calle: string

  @Prop({
    type: String,
    required: true,
    lenght: 100,
    default: '',
  })
  numero: string

  @Prop({
    type: String,
    required: true,
    lenght: 100,
    default: '',
  })
  ciudad: string

  @Prop({
    type: String,
    required: true,
    lenght: 100,
    default: '',
  })
  provincia: string

  @Prop({
    type: String,
    required: true,
    lenght: 100,
    default: '',
  })
  pais: string

  @Prop({
    type: String,
    required: true,
    lenght: 100,
    default: '',
  })
  codigoPostal: string
}
