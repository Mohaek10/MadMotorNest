import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateVehiculoDto } from './dto/create-vehiculo.dto'
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto'
import { VehiculoMapper } from './mappers/vehiculo-mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { Vehiculo } from './entities/vehiculo.entity'
import { Repository } from 'typeorm'
import { Categoria } from '../categorias/entities/categoria.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'
import { ResponseVehiculoDto } from './dto/response-vehiculo.dto'
import { Request } from 'express'
import { StorageService } from '../storage/storage.service'
import * as process from 'process'
import {
  Notificacion,
  NotificacionTipo,
} from '../../notification/model/notification.model'
import { NotificationGateway } from '../../notification/notification.gateway'

@Injectable()
export class VehiculosService {
  private readonly logger = new Logger(VehiculosService.name)

  constructor(
    private readonly vehiculoMapper: VehiculoMapper,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly storageService: StorageService,
    private readonly notificacionService: NotificationGateway,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Buscando todos los vehiculos')
    const cache = await this.cacheManager.get(
      `vehiculos_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Retornando vehiculos desde cache')
      return cache
    }
    const queryBuilder = this.vehiculoRepository
      .createQueryBuilder('vehiculo')
      .leftJoinAndSelect('vehiculo.categoria', 'categoria')

    const paginatedResult = await paginate(query, queryBuilder, {
      sortableColumns: ['marca', 'modelo', 'year', 'precio'],
      defaultSortBy: [['marca', 'ASC']],
      searchableColumns: ['marca', 'modelo', 'year', 'precio'],
      filterableColumns: {
        marca: [FilterOperator.EQ, FilterSuffix.NOT],
        modelo: [FilterOperator.EQ, FilterSuffix.NOT],
        year: [FilterOperator.GT, FilterSuffix.NOT],
        precio: [FilterOperator.GT, FilterOperator.LT, FilterSuffix.NOT],
        isDeleted: [FilterOperator.EQ],
      },
    })
    const resutado = {
      data: (paginatedResult.data ?? []).map((vehiculo) =>
        this.vehiculoMapper.toResponseVehiculoDto(vehiculo),
      ),
      meta: paginatedResult.meta,
      links: paginatedResult.links,
    }
    await this.cacheManager.set(
      `vehiculos_${hash(JSON.stringify(query))}`,
      resutado,
      800000,
    )
    return resutado
  }

  async findOne(id: number): Promise<ResponseVehiculoDto> {
    this.logger.log(`Buscando vehiculo con id ${id}`)
    const cache: ResponseVehiculoDto = await this.cacheManager.get(
      `vehiculo_${id}`,
    )
    if (cache) {
      this.logger.log('Retornando vehiculo desde cache')
      return cache
    }
    const buildVehiculo = await this.vehiculoRepository
      .createQueryBuilder('vehiculo')
      .leftJoinAndSelect('vehiculo.categoria', 'categoria')
      .where('vehiculo.id = :id', { id: id })
      .getOne()
    if (!buildVehiculo) {
      this.logger.warn(`No se encontro vehiculo con id ${id}`)
      throw new NotFoundException(`No se encontro vehiculo con id ${id}`)
    }
    const vehiculo = this.vehiculoMapper.toResponseVehiculoDto(buildVehiculo)
    await this.cacheManager.set(`vehiculo_${id}`, vehiculo, 800000)
    return vehiculo
  }

  async create(
    createVehiculoDto: CreateVehiculoDto,
  ): Promise<ResponseVehiculoDto> {
    this.logger.log('Creando vehiculo : ' + JSON.stringify(createVehiculoDto))
    const categoria = await this.comprobarCategoria(createVehiculoDto.categoria)
    const vehiculo = this.vehiculoMapper.toVehiculo(
      createVehiculoDto,
      categoria,
    )
    const vehiculoGuardado = await this.vehiculoRepository.save(vehiculo)
    const res = this.vehiculoMapper.toResponseVehiculoDto(vehiculoGuardado)
    await this.invalidateCacheKey('vehiculos')
    this.onChanges(NotificacionTipo.CREATE, res)
    return res
  }

  async update(
    id: number,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<ResponseVehiculoDto> {
    this.logger.log('Actualizando vehiculo : ' + JSON.stringify(id))
    const vehiculoToUpdate = this.vehiculoExists(id)
    let categoria: Categoria
    if (updateVehiculoDto.categoria) {
      categoria = await this.comprobarCategoria(updateVehiculoDto.categoria)
    } else {
      categoria = (await vehiculoToUpdate).categoria
    }
    const vehiculoNuevo = this.vehiculoMapper.toVehiculoFromUpdate(
      await vehiculoToUpdate,
      updateVehiculoDto,
      categoria,
    )
    const vehiculoActualizado =
      await this.vehiculoRepository.save(vehiculoNuevo)
    this.logger.log('Vehiculo actualizado')
    const res = this.vehiculoMapper.toResponseVehiculoDto(vehiculoActualizado)
    await this.invalidateCacheKey('vehiculos')
    this.onChanges(NotificacionTipo.UPDATE, res)
    return res
  }

  async remove(id: number): Promise<Vehiculo> {
    this.logger.log('Eliminando vehiculo : ' + id)
    const vehiculo = this.vehiculoExists(id)
    return await this.vehiculoRepository.remove(await vehiculo)
  }

  async borradoLogico(id: number): Promise<ResponseVehiculoDto> {
    this.logger.log('Eliminando vehiculo : ' + id)
    const vehiculo = await this.vehiculoExists(id)
    vehiculo.isDeleted = true
    const vehiculoBorrado = await this.vehiculoRepository.save(vehiculo)
    await this.invalidateCacheKey('vehiculos')
    const dto = this.vehiculoMapper.toResponseVehiculoDto(vehiculoBorrado)
    this.onChanges(NotificacionTipo.DELETE, dto)
    return dto
  }

  async actualizarImagenVehiculo(
    id: number,
    file: Express.Multer.File,
    req: Request,
    conUrl: boolean,
  ) {
    this.logger.log('Actualizando imagen de vehiculo : ' + id)
    let vehiculo: Vehiculo
    try {
      vehiculo = await this.vehiculoExists(id)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
    if (vehiculo.image !== 'https://picsum.photos/200') {
      this.logger.log('Eliminando imagen anterior')
      const nombreDeImagenSinUrl = vehiculo.image
      try {
        this.storageService.borraFichero(nombreDeImagenSinUrl)
      } catch (e) {
        this.logger.warn('No se pudo eliminar imagen anterior')
        throw new BadRequestException(
          'No se pudo eliminar imagen anterior : ' + e.message,
        )
      }
    }
    if (!file) {
      this.logger.warn('No se recibio imagen')
      throw new BadRequestException('No se recibio imagen')
    }
    let filePath: string

    if (conUrl) {
      this.logger.log('Generando Url')
      const version = process.env.API_VERSION
        ? `/${process.env.API_VERSION}`
        : 'v1'
      filePath = `${req.protocol}://${req.get('host')}${version}/storage/${file.filename}`
    } else {
      filePath = file.filename
    }

    vehiculo.image = file.filename
    this.logger.log('Guardando imagen: ' + filePath)
    await this.vehiculoRepository.save(vehiculo)
    await this.invalidateCacheKey('vehiculos')
    vehiculo.image = filePath
    const res = this.vehiculoMapper.toResponseVehiculoDto(vehiculo)
    this.onChanges(NotificacionTipo.UPDATE, res)
    return res
  }

  private async comprobarCategoria(nombreCate: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository
      .createQueryBuilder('categoria')
      .where('LOWER(nombre)=LOWER(:nombre)', {
        nombre: nombreCate.toLowerCase(),
      })
      .getOne()
    if (!categoria) {
      this.logger.warn(`No se encontro categoria con nombre ${nombreCate}`)
      throw new BadRequestException(
        `No se encontro categoria con nombre ${nombreCate}`,
      )
    }
    return categoria
  }
  public async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }
  public async vehiculoExists(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOneBy({ id })
    if (!vehiculo) {
      this.logger.warn(`No se encontro vehiculo con id ${id}`)
      throw new NotFoundException(`No se encontro vehiculo con id ${id}`)
    }
    return vehiculo
  }

  private onChanges(tipo: NotificacionTipo, data: ResponseVehiculoDto) {
    const notificacion = new Notificacion<ResponseVehiculoDto>(
      'vehiculo',
      tipo,
      data,
      new Date(),
    )
    this.notificacionService.sendMessage(notificacion)
  }
}
