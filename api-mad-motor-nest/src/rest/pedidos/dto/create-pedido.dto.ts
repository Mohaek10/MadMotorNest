import { ClienteDto } from './create-cliente.dto'
import { LineaDePedidoDto } from './create-lineapedido.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsNumber()
  idUsuario: number

  @IsNotEmpty()
  cliente: ClienteDto

  @IsNotEmpty()
  lineaDePedido: LineaDePedidoDto
}
