import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Controller('clientes')
@UseInterceptors(CacheInterceptor)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto)
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.clientesService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clientesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clientesService.remove(+id)
  }
}
