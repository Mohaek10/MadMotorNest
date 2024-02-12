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
  BadRequestException,
  Req,
  ParseIntPipe,
  UploadedFile,
} from '@nestjs/common'
import { ClientesService } from './clientes.service'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { Paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { CacheInterceptor } from '@nestjs/cache-manager'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody, ApiNotFoundResponse, ApiParam, ApiQuery,
  ApiResponse
} from "@nestjs/swagger";
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as process from 'process'
import { extname } from 'path'
import { Request } from 'express'
import { ResponseClienteDto } from "./dto/response-cliente.dto";

@Controller('clientes')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'El cliente ha sido creado.',
    type: CreateClienteDto,
  })
  @ApiResponse({ status: 201, description: 'Error de validación' })
  @ApiBody({
    description: 'Datos de cliente para crear',
    type: CreateClienteDto,
  })
  @ApiBadRequestResponse({ description: 'Error de validación' })
  @ApiBadRequestResponse({ description: 'EL dni enviado ya existe' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto)
  }

  @Get()
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description:
      'Lista de clinetes paginada.',
    type: Paginated<ResponseClienteDto>,
  })
  @ApiQuery({
    description: 'Filtro por limite por pagina',
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
    description: 'Filtro de ordenación',
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de busqueda: filter.name = $eq:name',
    name: 'filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de busqueda: search = valor',
    name: 'search',
    required: false,
    type: String,
  })
  findAll(@Paginate() query: PaginateQuery) {
    return this.clientesService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'El cliente has ido encontrado.',
    type: ResponseClienteDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Cliente id',
    type: Number,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'EL cliente no ha sido encontrado',
  })
  findOne(@Param('id') id: number) {
    return this.clientesService.findOne(+id)
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Cliente id',
    type: Number,
  })
  @ApiBody({
    description: 'Datos de cliente para actualizar',
    type: UpdateClienteDto,
  })
  @ApiBadRequestResponse({ description: 'Error de validación' })
  @ApiNotFoundResponse({
    status: 404,
    description: 'EL cliente no ha sido encontrado',
  })
  @ApiResponse({ status: 202, description: 'El cliente ha sido actualizado.',type: UpdateClienteDto})
  update(@Param('id') id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Cliente id',
    type: Number,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'EL cliente no ha sido encontrado',
  })
  @ApiResponse({ status: 200, description: 'El cliente ha sido eliminado.' })
  remove(@Param('id') id: number) {
    return this.clientesService.remove(+id)
  }
  @Patch('imagen/:id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Cliente id',
    type: Number,
  })
  @ApiBody({
    description: 'Imagen de cliente para actualizar',
    type: 'file',
  })
  @ApiBadRequestResponse({ description: 'Error de validación' })
  @ApiNotFoundResponse({
    status: 404,
    description: 'EL cliente no ha sido encontrado',
  })
  @ApiResponse({ status: 202, description: 'La imagen ha sido actualizada.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.FILESDIR || './uploads',
        filename: (req, file, cb) => {
          const fileName = uuidv4()
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Fichero no soportado.'), false)
        } else {
          cb(null, true)
        }
      },
    }),
  )
  async actualizarImagenCliente(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.clientesService.updateImage(id, file, req, true)
  }
}
