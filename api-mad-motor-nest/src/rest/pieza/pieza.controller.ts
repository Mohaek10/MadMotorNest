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
  NotFoundException,
  Put,
} from '@nestjs/common'
import { PiezaService } from './pieza.service'
import { CreatePiezaDto } from './dto/create-pieza.dto'
import { UpdatePiezaDto } from './dto/update-pieza.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { UUID } from 'crypto'
import { Roles, RolesAuthGuard } from 'src/auth/guards/roles-auth.guard'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
@Controller('pieza')
@UseInterceptors(CacheInterceptor)
export class PiezaController {
  constructor(private readonly piezaService: PiezaService) {}

  @Post()
  create(@Body() createPiezaDto: CreatePiezaDto) {
    return this.piezaService.create(createPiezaDto)
  }
  @CacheKey('all_pieza')
  @CacheTTL(30)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.piezaService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const PiezaToFound = await this.piezaService.findOne(id)
    if (!PiezaToFound) {
      throw new NotFoundException(`Pieza con id ${id} no encontrado`)
    }
    return PiezaToFound
  }

  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @Put(':id')
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
  async remove(@Param('id') id: string) {
    const piezaFind = await this.piezaService.findOne(id)
    if (!piezaFind) {
      throw new NotFoundException(`
    Pieza con id ${id} no encontrado)
    `)
    }
    return this.piezaService.remove(id)
  }
}
