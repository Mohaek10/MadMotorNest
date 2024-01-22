import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Categoria } from './entities/categoria.entity'
import { Repository } from 'typeorm'
import { CategoriasMapper } from './mappers/categorias.mapper'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly categoriaMapper: CategoriasMapper,
    @Inject(CACHE_MANAGER) private managerCache: Cache,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Obteniendo todos las categorias.')

    const cache = await this.managerCache.get(
      `all_categorias_page_${hash(JSON.stringify(query))}`,
    )

    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }
    const res = await paginate(query, this.categoriaRepository, {
      sortableColumns: ['nombre'],
      defaultSortBy: [['nombre', 'ASC']],
      searchableColumns: ['nombre'],
      filterableColumns: {
        nombre: [FilterOperator.EQ, FilterSuffix.NOT],
        activa: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    })
    console.log(res)
    await this.managerCache.set(
      `all_categorias_page_${hash(JSON.stringify(query))}`,
      res,
      60,
    )
    return res
  }

  async findOne(id: string) {
    this.logger.log(`Obteniendo la categoria con el ID: ${id}`)

    const cache: Categoria = await this.managerCache.get(`categoria_${id}`)
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }

    const found = await this.categoriaRepository.findOneBy({ id })
    if (!found) {
      throw new NotFoundException(
        `La categoria con ID (${id}) no ha sido encontrada.`,
      )
    }

    await this.managerCache.set(`categoria_${id}`, found, 60)
    return found
  }

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    this.logger.log('Creando nueva categoria.')
    const creandoCategoria =
      await this.categoriaMapper.mapCreateDtotoEntity(createCategoriaDto)

    const categoria = await this.exists(creandoCategoria.nombre)

    if (categoria) {
      this.logger.log(`La categoria con nombre: ${categoria.nombre} ya existe`)
      throw new BadRequestException(
        `La categoria con nombre ${categoria.nombre} ya existe`,
      )
    }

    const res = await this.categoriaRepository.save({
      ...creandoCategoria,
      id: uuidv4(),
    })

    await this.invalidateCacheKey('all_categorias')
    return res
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    this.logger.log(`Actualizando el funko con ID: ${id}`)
    const updateCategoria = await this.findOne(id)

    if (updateCategoriaDto.nombre) {
      const categoria = await this.exists(updateCategoria.nombre)
      if (categoria && categoria.id !== updateCategoria.id) {
        this.logger.log(
          `La categoria con el nombre ${categoria.nombre} ya existe`,
        )
        throw new BadRequestException(
          `La categoria con el nombre ${categoria.nombre} ya existe`,
        )
      }
    }

    const res = await this.categoriaRepository.save({
      ...updateCategoria,
      ...updateCategoriaDto,
    })

    await this.invalidateCacheKey(`categoria_${id}`)
    await this.invalidateCacheKey('all_categorias')
    return res
  }

  async remove(id: string) {
    this.logger.log(`Eliminando categoria con ID: ${id}`)
    const removeCategoria = await this.findOne(id)
    const res = await this.categoriaRepository.remove(removeCategoria)

    await this.invalidateCacheKey(`catgoria_${id}`)
    await this.invalidateCacheKey('all_categorias')
    return res
  }

  public async exists(nombreCategoria: string): Promise<Categoria> {
    const cache: Categoria = await this.managerCache.get(
      `categoria_name_${nombreCategoria}`,
    )
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }

    const categoria = await this.categoriaRepository
      .createQueryBuilder()
      .where('LOWER(nombre) = LOWER(:nombre)', {
        nombre: nombreCategoria.toLowerCase(),
      })
      .getOne()

    await this.managerCache.set(
      `categoria_name_${nombreCategoria}`,
      categoria,
      60,
    )
  }

  async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.managerCache.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.managerCache.del(key))
    await Promise.all(promises)
  }
}
