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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@ApiTags('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  @Roles('ADMIN')
  @ApiResponse({ status: 200, description: 'Todos los pedidos paginados' })
  @HttpCode(200)
  @ApiQuery({
    description: 'Filtro por limite de pagina',
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro por pagina',
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro de ordenación: campo:ASC|DESC',
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de busqueda',
    name: 'search',
    required: false,
    type: String,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'createdAt',
    @Query('order') order = 'desc',
  ) {
    return await this.pedidosService.findAll(page, limit, orderBy, order)
  }

  @Get(':id')
  @Roles('ADMIN')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiParam({
    description: 'Id del pedido',
    name: 'id',
    required: true,
    type: String,
  })
  @ApiBadRequestResponse({ status: 400, description: 'Pedido no encontrado' })
  @ApiBadRequestResponse({ status: 400, description: 'Id no válido' })
  findOne(@Param('id', ObjectIdPipe) id: string) {
    return this.pedidosService.findOne(id)
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(UsuarioGuard)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Pedido creado',
  })
  @ApiBody({
    description: 'Datos del pedido',
    type: CreatePedidoDto,
  })
  @ApiBadRequestResponse({ status: 400, description: 'Datos no validos' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'El precio no corresponde al vehiculo/pieza',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'El vehiculo/pieza no existe',
  })
  @ApiBadRequestResponse({ status: 400, description: 'El cliente no existe' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'La cantidad es incorrecta',
  })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto)
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('ADMIN')
  @UseGuards(UsuarioGuard)
  @ApiParam({
    description: 'Id del pedido',
    name: 'id',
    required: true,
    type: String,
  })
  @ApiBody({
    description: 'Datos del pedido',
    type: UpdatePedidoDto,
  })
  @ApiBadRequestResponse({ status: 400, description: 'Datos no validos' })
  @ApiBadRequestResponse({ status: 400, description: 'El pedido no existe' })
  @ApiBadRequestResponse({ status: 400, description: 'El cliente no existe' })
  @ApiBadRequestResponse({ status: 400, description: 'El usuario no existe' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'La cantidad es incorrecta',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'El precio no corresponde',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'El vehiculo/pieza no existe',
  })
  update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiParam({
    description: 'Id del pedido',
    name: 'id',
    required: true,
    type: String,
  })
  @ApiBadRequestResponse({ status: 400, description: 'El pedido no existe' })
  @ApiBadRequestResponse({ status: 400, description: 'Id no válido' })
  remove(@Param('id', ObjectIdPipe) id: string) {
    return this.pedidosService.remove(id)
  }
}
