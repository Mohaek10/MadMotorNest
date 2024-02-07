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

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.vehiculosService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.vehiculosService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculosService.update(id, updateVehiculoDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.borradoLogico(id)
  }

  @Patch('imagen/:id')
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
