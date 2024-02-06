import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Cliente } from './cliente.schema'
import { LineaDePedido } from './lineaPedido.schema'
import * as mongoosePaginate from 'mongoose-paginate-v2'

export type PedidoDocument = Pedido & Document

@Schema({
  collection: 'pedidos',
  timestamps: false,
  versionKey: false,
  id: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id
      ret.id = ret._id
      delete ret.__v
      delete ret._class
    },
  },
})
export class Pedido {
  @Prop({
    type: Number,
    required: true,
  })
  idUsuario: number

  @Prop({
    required: true,
  })
  cliente: Cliente

  @Prop({
    required: true,
  })
  lineasDePedido: LineaDePedido[]

  @Prop()
  totalItems: number

  @Prop()
  totalPedido: number

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: false })
  isDeleted: boolean
}
export const PedidoSchema = SchemaFactory.createForClass(Pedido)
PedidoSchema.plugin(mongoosePaginate)
