import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common'
import { PedidosService } from './pedidos.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { ObjectIdPipe } from './pipes/object-id.pipe'
import { UsuarioGuard } from './guard/usuario.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'

@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'createdAt',
    @Query('order') order = 'desc',
  ) {
    return await this.pedidosService.findAll(page, limit, orderBy, order)
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ObjectIdPipe) id: string) {
    return this.pedidosService.findOne(id)
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(UsuarioGuard)
  @HttpCode(201)
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto)
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('ADMIN')
  @UseGuards(UsuarioGuard)
  update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  remove(@Param('id', ObjectIdPipe) id: string) {
    return this.pedidosService.remove(id)
  }
}
