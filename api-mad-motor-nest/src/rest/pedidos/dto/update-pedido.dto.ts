import { PartialType } from '@nestjs/mapped-types'
import { CreatePedidoDto } from './create-pedido.dto'
import { ClienteDto } from './create-cliente.dto'
import { LineaDePedidoDto } from './create-lineapedido.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsNotEmpty()
  @IsNumber()
  idUsuario: number

  @IsNotEmpty()
  cliente: ClienteDto

  @IsNotEmpty()
  lineasDePedido: LineaDePedidoDto
}
