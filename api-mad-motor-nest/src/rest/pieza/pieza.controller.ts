import { Controller, Get, Param, Post, Put, Delete, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { PiezaService } from './pieza.service';
import { CreatePiezaDto } from './dto/create-pieza.dto';
import { UpdatePiezaDto } from './dto/update-pieza.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import {Paginate, PaginateQuery} from "nestjs-paginate";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';

@ApiTags('pieza')
@Controller('pieza')
export class PiezaController {
  constructor(private readonly piezaService: PiezaService) {}

  /**
   * Buscar todas las piezas paginadas
   * @param query Query de paginación
   * @returns Lista de piezas paginadas
   */
  @ApiOperation({ summary: 'Buscar todas las piezas paginadas' })
  @ApiResponse({ status: 200, description: 'Lista de piezas paginadas' })
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.piezaService.findAll(query);
  }
  /**
   * Buscar una pieza por su ID
   * @param id ID de la pieza a buscar
   * @returns La pieza encontrada
   * @throws NotFoundException Si la pieza no se encuentra
   */

  @ApiOperation({ summary: 'Buscar una pieza por su ID' })
  @ApiNotFoundResponse({ description: 'Pieza no encontrada' })
  @ApiResponse({ status: 200, description: 'Pieza encontrada' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const PiezaToFound = await this.piezaService.findOne(id);
    if (!PiezaToFound) {
      throw new NotFoundException(`Pieza con id ${id} no encontrado`);
    }
    return PiezaToFound;
  }

  /**
   * Actualizar una pieza por su ID
   * @param id ID de la pieza a actualizar
   * @param updatePiezaDto Datos de la pieza a actualizar
   * @returns La pieza actualizada
   * @throws NotFoundException Si la pieza no se encuentra
   */
  @ApiOperation({ summary: 'Actualizar una pieza por su ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Pieza actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'Pieza no encontrada' })
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Put(':id')
  async update(
      @Param('id') id: string,
      @Body() updatePiezaDto: UpdatePiezaDto,
  ) {
    const piezaFind = await this.piezaService.findOne(id);
    if (!piezaFind) {
      throw new NotFoundException(`Pieza con id ${id} no encontrado`);
    }
    return this.piezaService.update(id, updatePiezaDto);
  }
  /**
   * Eliminar una pieza por su ID
   * @param id ID de la pieza a eliminar
   * @returns La pieza eliminada
   * @throws NotFoundException Si la pieza no se encuentra
   */

  @ApiOperation({ summary: 'Eliminar una pieza por su ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Pieza eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Pieza no encontrada' })
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const piezaFind = await this.piezaService.findOne(id);
    if (!piezaFind) {
      throw new NotFoundException(`Pieza con id ${id} no encontrado`);
    }
    return this.piezaService.remove(id);
  }
  /**
   * Crear una nueva pieza
   * @param createPiezaDto Datos de la nueva pieza a crear
   * @returns La nueva pieza creada
   */

  @ApiOperation({ summary: 'Crear una nueva pieza' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Pieza creada correctamente' })
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Post()
  async create(@Body() createPiezaDto: CreatePiezaDto) {
    return this.piezaService.create(createPiezaDto);
  }
}
