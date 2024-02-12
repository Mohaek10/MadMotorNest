import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common'
import { VehiculosService } from './vehiculos.service'
import { CreateVehiculoDto } from './dto/create-vehiculo.dto'
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as process from 'process'
import { Request } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ResponseVehiculoDto } from './dto/response-vehiculo.dto'

@Controller('vehiculos')
@ApiTags('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Todos los vehiculos paginados' })
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
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.vehiculosService.findAll(query)
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Vehiculo encontrado' })
  @ApiBadRequestResponse({ description: 'Vehiculo no encontrado' })
  @ApiParam({
    description: 'Id del vehiculo',
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBadRequestResponse({ description: 'El Id no es valido' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.vehiculosService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiResponse({
    status: 201,
    description: 'Vehiculo creado',
    type: ResponseVehiculoDto,
  })
  @ApiBadRequestResponse({ description: 'Datos no validos' })
  @ApiBody({
    description: 'Datos del vehiculo',
    type: CreateVehiculoDto,
  })
  @ApiBadRequestResponse({ description: 'La categoria no existe' })
  @ApiBearerAuth()
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(201)
  @ApiParam({
    description: 'Id del vehiculo',
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'Datos del vehiculo',
    type: UpdateVehiculoDto,
  })
  @ApiBadRequestResponse({ description: 'Datos no validos' })
  @ApiBadRequestResponse({ description: 'La categoria no existe' })
  @ApiResponse({
    status: 201,
    description: 'Vehiculo actualizado',
    type: ResponseVehiculoDto,
  })
  @ApiBadRequestResponse({ description: 'El Id no es valido' })
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculosService.update(id, updateVehiculoDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiParam({
    description: 'Id del vehiculo',
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBadRequestResponse({ description: 'El Id no es valido' })
  @ApiBadRequestResponse({ description: 'Vehiculo no encontrado' })
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.borradoLogico(id)
  }

  @Patch('imagen/:id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'Imagen actualizada',
    type: ResponseVehiculoDto,
  })
  @ApiBadRequestResponse({ description: 'Fichero no soportado' })
  @ApiBadRequestResponse({ description: 'No se ha enviado ninguna imagen' })
  @ApiParam({
    description: 'Id del vehiculo',
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiProperty({
    name: 'file',
    description: 'Fichero de imagen',
    type: 'string',
    format: 'binary',
  })
  @ApiBody({
    description: 'Fichero de imagen',
    type: FileInterceptor('file'),
  })
  @ApiNotFoundResponse({ description: 'Vehiculo no encontrado' })
  @ApiConsumes('multipart/form-data')
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
  async actualizarImagenVehiculo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha enviado ninguna imagen')
    }
    const vehiculoActualizado =
      await this.vehiculosService.actualizarImagenVehiculo(id, file, req, true)
    await this.vehiculosService.invalidateCacheKey('vehiculos')
    return vehiculoActualizado
  }
}
