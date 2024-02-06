import { Injectable } from '@nestjs/common'
import { CreatePedidoDto } from '../dto/create-pedido.dto'
import { Pedido } from '../schemas/pedido.schema'
import { plainToClass } from 'class-transformer'

@Injectable()
export class PedidosMapper {
  toPedido(createPedido: CreatePedidoDto): Pedido {
    return plainToClass(Pedido, createPedido)
  }
}
