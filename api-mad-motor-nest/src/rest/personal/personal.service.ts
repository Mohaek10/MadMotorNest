import {Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePersonalDto } from './dto/create-personal.dto'
import { UpdatePersonalDto } from './dto/update-personal.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Personal } from './entities/personal.entity'
import { PersonalMapper } from './mappers/personal.mapper'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ResponsePersonalDto } from './dto/response-personal.dto'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'


@Injectable()
export class PersonalService {
  private readonly logger = new Logger(PersonalService.name)

  constructor(
    private readonly personalMapper: PersonalMapper,
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }
  async create(createPersonalDto: CreatePersonalDto): Promise<ResponsePersonalDto> {
    this.logger.log('Creando personal: ' + JSON.stringify(createPersonalDto))
    const personal = this.personalMapper.toEntity(createPersonalDto)
    const personalCreado = await this.personalRepository.save(personal)
    const res = this.personalMapper.toResponseDto(personalCreado)
    await this.invalidateCacheKeys('personal')
    return res
  }

  async findAll(query: PaginateQuery) {
    this.logger.log('Buscando todos el personal')
    const cache = await this.cacheManager.get(`vehiculos_${hash(JSON.stringify(query))}`)
    if (cache) {
      this.logger.log('Devolviendo personal desde cache')
      return cache
    }
    const queryBuilder = this.personalRepository
      .createQueryBuilder('personal')

    const paginatedResult = await paginate(query, queryBuilder, {
        sortableColumns: ['nombre', 'apellidos', 'dni', 'telefono', 'fechaNacimiento', 'sueldo', 'iban', 'email', 'direccion'],
        defaultSortBy: [['nombre', 'ASC']],
        searchableColumns: ['nombre', 'apellidos', 'dni', 'telefono', 'fechaNacimiento', 'sueldo', 'iban', 'email', 'direccion'],
        filterableColumns: {
            nombre: [FilterOperator.EQ, FilterSuffix.NOT],
            apellido: [FilterOperator.EQ, FilterSuffix.NOT],
            dni: [FilterOperator.EQ, FilterSuffix.NOT],
            telefono: [FilterOperator.EQ, FilterSuffix.NOT],
        },
        })

    const resultado = {
      data: (paginatedResult.data ?? []).map((personal) =>
          this.personalMapper.toResponseDto(personal),
      ),
      meta: paginatedResult.meta,
      links: paginatedResult.links,
    }
    await this.cacheManager.set(
        `vehiculos_${hash(JSON.stringify(query))}`,
        resultado,
        800000,
    )

    return resultado
    }

  async findOne(id: number): Promise<ResponsePersonalDto> {
    this.logger.log(`Buscando personal con id ${id}`)
    const cache: ResponsePersonalDto = await this.cacheManager.get(
      `personal_${id}`,
    )
    if (cache) {
      this.logger.log('Devolviendo personal desde cache')
      return cache
    }
    const personalABuscar = await this.personalExists(id)
    const personal = this.personalMapper.toResponseDto(personalABuscar)
    await this.cacheManager.set(`personal_${id}`, personal, 800000)
    return personal
  }

  async update(id: number, updatePersonalDto: UpdatePersonalDto): Promise<ResponsePersonalDto> {
    this.logger.log(`Actualizando personal con id ${id}`)
    const personalAActualizar = this.personalExists(id)
    const personalNuevo = this.personalMapper.toUpdateDto(updatePersonalDto, await personalAActualizar)
    const personalActualizado = await this.personalRepository.save(personalNuevo)
    const res = this.personalMapper.toResponseDto(personalActualizado)
    await this.invalidateCacheKeys('personal')
    return res
  }

  async remove(id: number): Promise<Personal> {
    this.logger.log(`Eliminando personal con id ${id}`)
    const personalAEliminar = this.personalExists(id)
    return await this.personalRepository.remove(await personalAEliminar)
  }



  private async personalExists(id: number): Promise<Personal> {
    const personal = await this.personalRepository.findOneBy({id})
    if (!personal) {
      this.logger.warn(`No se encontro personal con id ${id}`)
      throw new NotFoundException(`No se encontro personal con id ${id}`)
    }
    return personal
  }

  private async invalidateCacheKeys(keyPattern: string): Promise<void>{
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }
}
