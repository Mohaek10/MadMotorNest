import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreatePiezaDto } from './dto/create-pieza.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Cache } from 'cache-manager'
import { Request } from 'express'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'
import { Pieza } from './entities/pieza.entity'
import { StorageService } from '../../storage/storage.service'
import { Piezasmapper } from './piezasmapper/piezasmapper'
import { UpdatePiezaDto } from './dto/update-pieza.dto'

@Injectable()
export class PiezasService {
  private readonly logger: Logger = new Logger(PiezasService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Pieza)
    private readonly PiezaRepository: Repository<Pieza>,
    private readonly piezaMapper: Piezasmapper,
    private readonly storageService: StorageService,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Find all piezas')
    const cache = await this.cacheManager.get(
      `all_piezas_page_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }

    const queryBuilder = this.PiezaRepository.createQueryBuilder('piezas')

    const pagination = await paginate(query, queryBuilder, {
      sortableColumns: ['nombre', 'precio', 'cantidad', 'isDeleted'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['nombre', 'precio', 'isDeleted'],
      filterableColumns: {
        nombre: [FilterOperator.EQ, FilterSuffix.NOT],
        precio: [FilterOperator.EQ, FilterSuffix.NOT],
        isDeleted: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    })

    const res = {
      data: (pagination.data ?? []).map((product) =>
        this.piezaMapper.toResponseDto(product),
      ),
      meta: pagination.meta,
      links: pagination.links,
    }

    await this.cacheManager.set(
      `all_piezas_page_${hash(JSON.stringify(query))}`,
      res,
      60,
    )
    return res
  }

  async findOne(id: number) {
    this.logger.log(`Find one Pieza by id:${id}`)
    const cache: Pieza = await this.cacheManager.get(`Pieza_${id}`)
    if (cache) {
      this.logger.log(`Pieza with id:${id} found in cache`)
      return cache
    }
    const PiezaFind = await this.PiezaRepository.createQueryBuilder('Pieza')
      .leftJoinAndSelect('Pieza.categoria', 'categoria')
      .where('Pieza.id = :id', { id })
      .getOne()

    if (!PiezaFind) {
      throw new NotFoundException(`Pieza con id ${id} no encontrado`)
    }
    await this.cacheManager.set(
      `Pieza_${id}`,
      this.piezaMapper.toResponseDto(PiezaFind),
      60,
    )
    return PiezaFind
  }

  async create(createPiezaDto: CreatePiezaDto) {
    this.logger.log('Create Pieza ${createPiezaDto}')
    const PiezaToCreate = this.piezaMapper.toPiezaFromCreate(createPiezaDto)
    const PiezaCreated = await this.PiezaRepository.save(PiezaToCreate)
    await this.invalidateCacheKey('all_Piezas')
    return this.piezaMapper.toResponseDto(PiezaCreated)
  }

  async update(id: number, updatePiezaDto: UpdatePiezaDto) {
    this.logger.log(`Update Pieza by id:${id} - ${updatePiezaDto}`)
    const PiezaUpdate = await this.findOne(id)
    const PiezaUpdated = await this.PiezaRepository.save({
      ...PiezaUpdate,
      ...updatePiezaDto,
    })
    if (!PiezaUpdate) {
      throw new NotFoundException(`Pieza con id ${id} no encontrado`)
    }
    await this.invalidateCacheKey(`Pieza_${id}`)
    await this.invalidateCacheKey('all_Piezas')
    return this.piezaMapper.toResponseDto(PiezaUpdated)
  }

  async remove(id: number) {
    this.logger.log(`Remove Pieza by id:${id}`)
    const productToRemove = await this.findOne(id)
    return await this.PiezaRepository.remove(productToRemove)
  }

  async removeSoft(id: number) {
    this.logger.log(`Remove Pieza by id:${id}`)
    const productToRemove = await this.findOne(id)
    productToRemove.isDeleted = true
    return await this.PiezaRepository.save(productToRemove)
  }



  async updateImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = true,
  ) {
    this.logger.log(`Update image Pieza by id:${id}`)
    const PiezaToUpdate = await this.findOne(id)

    if (PiezaToUpdate.imagen !== Pieza.IMAGE_DEFAULT) {
      this.logger.log(`Deleting image ${PiezaToUpdate.imagen}`)
      let imagePath = PiezaToUpdate.imagen
      if (withUrl) {
        imagePath = this.storageService.getFileNameWithouUrl(
          PiezaToUpdate.imagen,
        )
      }
      try {
        this.storageService.removeFile(imagePath)
      } catch (error) {
        this.logger.error(error)
      }
    }

    if (!file) {
      throw new BadRequestException('File not found.')
    }

    let filePath: string

    if (withUrl) {
      this.logger.log(`Generating URL for ${file.filename}`)
      const apiVersion = process.env.API_VERSION
        ? `/${process.env.API_VERSION}`
        : ''
      filePath = `${req.protocol}:         file.filename
      }`
    } else {
      filePath = file.filename
    }

    PiezaToUpdate.imagen = filePath
    const PiezaUpdated = await this.PiezaRepository.save(PiezaToUpdate)
    const dto = this.piezaMapper.toResponseDto(PiezaUpdated)
    await this.invalidateCacheKey(`Pieza_${id}`)
    await this.invalidateCacheKey('all_Piezas')
    return dto
  }

  async invalidateCacheKey(key: string): Promise<void> {
    await this.cacheManager.del(key)
  }
}
