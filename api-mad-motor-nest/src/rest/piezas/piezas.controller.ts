import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { diskStorage } from 'multer'
import { extname, parse } from 'path'
import { Request } from 'express'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
//import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

//@ApiTags('funko')
//@ApiBearerAuth()
@Controller('funko')
//@UseInterceptors(CacheInterceptor)
//@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class FunkosController {
  constructor(private readonly funkoService: FunkosService) {}

  @ApiOperation({ summary: 'Create a new Funko' })
  @ApiResponse({ status: 201, description: 'Funko created successfully' })
  @Roles('ADMIN')
  @HttpCode(201)
  @Post()
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    console.log('Funko recibido:', createFunkoDto)
    return this.funkoService.create(createFunkoDto)
  }

  @ApiOperation({ summary: 'Get all Funkos' })
  @ApiResponse({
    status: 200,
    description: 'List of all Funkos',
    type: Funko,
    isArray: true,
  })
  @CacheKey('all_funko')
  @CacheTTL(30)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.funkoService.findAll(query)
  }

  @ApiOperation({ summary: 'Get a specific Funko by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found Funko',
    type: Funko,
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Funko ID' })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Funko> {
    const foundFunko = await this.funkoService.findOne(id)
    if (!foundFunko) {
      throw new NotFoundException(`Funko with id ${id} not found`)
    }

    return foundFunko
  }

  @ApiOperation({ summary: 'Update a Funko by ID' })
  @ApiResponse({
    status: 200,
    description: 'Funko updated successfully',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Funko ID' })
  @Roles('ADMIN')
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    return this.funkoService.update(+id, updateFunkoDto)
  }

  @ApiOperation({ summary: 'Delete a Funko by ID' })
  @ApiResponse({
    status: 204,
    description: 'Funko deleted successfully',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Funko ID' })
  @Roles('ADMIN')
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.funkoService.remove(+id)
  }

  @ApiOperation({ summary: 'Update image for a Funko by ID' })
  @ApiResponse({
    status: 200,
    description: 'Funko image updated successfully',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Funko ID' })
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOADS_DIR || './storage-dir',
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']
        const maxFileSize = 1024 * 1024
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Fichero no soportado. No es del tipo imagen válido',
            ),
            false,
          )
        } else if (file.size > maxFileSize) {
          cb(
            new BadRequestException(
              'El tamaño del archivo no puede ser mayor a 1 megabyte.',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  @Patch('/imagen/:id')
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.funkoService.updateImage(id, file, req, true)
  }
}
