import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { CacheInterceptor } from '@nestjs/cache-manager'
import {Roles, RolesAuthGuard} from "../auth/guards/roles-auth.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('clientes')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard,RolesAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto)
  }

  @Get()
  @Roles('ADMIN')

  findAll(@Paginate() query: PaginateQuery) {
    return this.clientesService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN')

  findOne(@Param('id') id: number) {
    return this.clientesService.findOne(+id)
  }

  @Patch(':id')
  @Roles('ADMIN')

  update(@Param('id') id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto)
  }

  @Delete(':id')
  @Roles('ADMIN')

  remove(@Param('id') id: number) {
    return this.clientesService.remove(+id)
  }
}
