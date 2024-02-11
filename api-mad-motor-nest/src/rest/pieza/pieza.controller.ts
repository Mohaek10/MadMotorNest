import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  NotFoundException,
  Put, UseGuards,
} from '@nestjs/common'
import { PiezaService } from './pieza.service'
import { CreatePiezaDto } from './dto/create-pieza.dto'
import { UpdatePiezaDto } from './dto/update-pieza.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import {Roles, RolesAuthGuard} from "../auth/guards/roles-auth.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
@Controller('pieza')
@UseGuards(JwtAuthGuard,RolesAuthGuard)
@UseInterceptors(CacheInterceptor)
export class PiezaController {
  constructor(private readonly piezaService: PiezaService) {}


  @CacheKey('all_pieza')
  @CacheTTL(30)
  @Get()
  @Roles('USER')
  async findAll(@Paginate() query: PaginateQuery) {
    return this.piezaService.findAll(query)
  }

  @Get(':id')
  @Roles('USER')
  async findOne(@Param('id') id: string) {
    const PiezaToFound = await this.piezaService.findOne(id)
    if (!PiezaToFound) {
      throw new NotFoundException(`Pieza con id ${id} no encontrado`)
    }
    return PiezaToFound
  }
  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updatePiezaDto: UpdatePiezaDto,
  ) {
    const piezaFind = await this.piezaService.findOne(id)
    if (!piezaFind) {
      throw new NotFoundException(`
    Pieza con id ${id} no encontrado)
    `)
    }
    return this.piezaService.update(id, updatePiezaDto)
  }
  @Delete(':id')
  @Roles('ADMIN')

  async remove(@Param('id') id: string) {
    const piezaFind = await this.piezaService.findOne(id)
    if (!piezaFind) {
      throw new NotFoundException (`
    Pieza con id ${id} no encontrado)
    `)
    }

    return this.piezaService.remove(id)
  }
  @Post()
  @Roles('ADMIN')
  create(@Body() createPiezaDto: CreatePiezaDto) {
    return this.piezaService.create(createPiezaDto)
  }
}
