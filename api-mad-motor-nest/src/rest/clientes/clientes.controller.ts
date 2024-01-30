import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { DniGuard } from './guards/dni.guard'
import { Paginate, PaginateQuery } from 'nestjs-paginate'

@Controller('clientes')
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
  @UseGuards(DniGuard)
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(DniGuard)
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto)
  }

  @Delete(':id')
  @UseGuards(DniGuard)
  remove(@Param('id') id: string) {
    return this.clientesService.remove(id)
  }
}
