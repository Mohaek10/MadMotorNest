import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Put,
  HttpCode,
  UseInterceptors,
  ParseUUIDPipe, UseGuards,
} from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import {Roles, RolesAuthGuard} from "../auth/guards/roles-auth.guard";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('categorias')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class CategoriasController {
  private readonly logger = new Logger(CategoriasController.name)

  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @CacheKey('all_categorias')
  @CacheTTL(30)
  @Roles('USER')
  async findAll(@Paginate() query: PaginateQuery) {
    this.logger.log('Obteniendo todas las categorias.')
    return await this.categoriasService.findAll(query)
  }

  @Get(':id')
  @Roles('USER')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Obteniendo la categoria con ID: ${id}`)
    return await this.categoriasService.findOne(id)
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(201)
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    this.logger.log('Creando categoria.')
    return await this.categoriasService.create(createCategoriaDto)
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    this.logger.log(`Actualizando categoria con ID: ${id}`)
    return await this.categoriasService.update(id, updateCategoriaDto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(202)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Borrando categoria con ID: ${id}`)
    await this.categoriasService.removeSoft(id)
  }
}
