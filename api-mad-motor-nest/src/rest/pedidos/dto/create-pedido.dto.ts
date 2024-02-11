import { ClienteDto } from './create-cliente.dto'
import { LineaDePedidoDto } from './create-lineapedido.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePedidoDto {
  @ApiProperty({
    description: 'Id del usuario',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  idUsuario: number

  @ApiProperty({
    description: 'Cliente del pedido',
    type: ClienteDto,
    required: true,
  })
  @IsNotEmpty()
  cliente: ClienteDto

  @ApiProperty({
    description: 'Lineas de pedido',
    type: LineaDePedidoDto,
    required: true,
  })
  @IsNotEmpty()
  lineasDePedido: LineaDePedidoDto
}
