import { PartialType } from '@nestjs/mapped-types'
import { CreatePedidoDto } from './create-pedido.dto'
import { ClienteDto } from './create-cliente.dto'
import { LineaDePedidoDto } from './create-lineapedido.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
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
