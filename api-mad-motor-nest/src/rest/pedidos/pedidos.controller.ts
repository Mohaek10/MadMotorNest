import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { PedidosService } from './pedidos.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { ObjectIdPipe } from './pipes/object-id.pipe'

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'createdAt',
    @Query('order') order = 'desc',
  ) {
    return await this.pedidosService.findAll(page, limit, orderBy, order)
  }

  @Get(':id')
  findOne(@Param('id', ObjectIdPipe) id: string) {
    return this.pedidosService.findOne(id)
  }

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto)
  }

  @Patch(':id')
  update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto)
  }

  @Delete(':id')
  remove(@Param('id', ObjectIdPipe) id: string) {
    return this.pedidosService.remove(id)
  }
}
