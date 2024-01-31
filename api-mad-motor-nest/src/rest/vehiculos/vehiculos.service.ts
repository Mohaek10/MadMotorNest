import { Inject, Injectable, Logger } from '@nestjs/common'
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

  findOne(id: number) {
    return `This action returns a #${id} vehiculo`
  }

  async create(createVehiculoDto: CreateVehiculoDto) {
    return 'This action adds a new vehiculo'
  }

  update(id: number, updateVehiculoDto: UpdateVehiculoDto) {
    return `This action updates a #${id} vehiculo`
  }

  remove(id: number) {
    return `This action removes a #${id} vehiculo`
  }
}
