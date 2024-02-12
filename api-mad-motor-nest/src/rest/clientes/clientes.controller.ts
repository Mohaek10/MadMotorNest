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
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiResponse } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as process from 'process'
import { extname } from 'path'
import { Request } from 'express'

@Controller('clientes')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
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
  async actualizarImagenCliente(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.clientesService.updateImage(id, file, req, true)
  }
}
