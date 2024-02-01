import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreatePiezaDto } from './dto/create-pieza.dto'
import { UpdatePiezaDto } from './dto/update-pieza.dto'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pieza } from './entities/pieza.entity'
import { PiezaMapper } from './mappers/pieza-mapper'
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  paginate,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'

@Injectable()
export class PiezaService {
  private readonly logger: Logger = new Logger(PiezaService.name)

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Pieza)
    private readonly piezaRepository: Repository<Pieza>,
    /*     private readonly WebsocketGateway: WebsocketGateway,
     */ private readonly piezaMapper: PiezaMapper,
    /*     private readonly storageService: StorageService,
     */
  ) {}

  /**
   * Esta función devuelve todos los piezas paginados y los mete en cache
   * @param query
   * @returns  {Promise<PaginateResult<Pieza>>}
   *
   */
  async findAll(query: PaginateQuery) {
    this.logger.log('Buscando todas las piezas')
    const cache = await this.cacheManager.get(
      `all_piezas_page_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }

    const queryBuilder = this.piezaRepository.createQueryBuilder('pieza');

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
      data: (pagination.data ?? []).map((pieza) =>
        this.piezaMapper.toResponseDto(pieza),
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

  /**
   * Esta función devuelve un pieza por id y lo mete en cache
   * @param id
   * @returns {Promise<Pieza>}
   *
   */

  async findOne(id: string) {
    this.logger.log(`Buscar una pieza por id:${id}`)
    const cache: Pieza = await this.cacheManager.get(`pieza_${id}`)
    if (cache) {
      this.logger.log(`Pieza with id:${id} found in cache`)
      return cache
    }
    const piezaFind = await this.piezaRepository
      .createQueryBuilder('pieza')
      .where('pieza.id = :id', { id })
      .getOne()

    if (!piezaFind) {
      throw new NotFoundException(`pieza con id ${id} no encontrado`)
    }
    await this.cacheManager.set(
      `pieza_${id}`,
      this.piezaMapper.toResponseDto(piezaFind),
      60,
    )
    return piezaFind
  }

  /**
   * Esta función crea un pieza y lo mete en la base de datos y en cache y devuelve un piezaResponseDto
   * @param createPiezaDto
   * @returns {Promise<PiezaResponseDto>}
   */

  async create(createPiezaDto: CreatePiezaDto) {
    this.logger.log('Creando pieza ${createpiezaDto}')
    const piezaToCreate = this.piezaMapper.toPiezaFromCreate(createPiezaDto)
    const piezaCreated = await this.piezaRepository.save(piezaToCreate)
    /*     this.WebsocketGateway.sendMessage(piezaCreated)
     */ await this.invalidateCacheKey('all_piezas')
    return this.piezaMapper.toResponseDto(piezaCreated)
  }

  /**
   * Esta función actualiza un pieza por id y lo mete en cache y devuelve un piezaResponseDto
   * @param id
   * @param updatePiezaDto
   * @returns {Promise<PiezaResponseDto>} Devuelve el pieza actualizado
   */

  async update(id: string, updatePiezaDto: UpdatePiezaDto) {
    this.logger.log(`Actualizar pieza por id:${id} - ${updatePiezaDto}`)
    const piezaUpdate = await this.exists(id)

    const piezaUpdated = await this.piezaRepository.save({
      ...piezaUpdate,
      ...updatePiezaDto,
    })
    if (!piezaUpdate) {
      throw new NotFoundException(`pieza con id ${id} no encontrado`)
    }
    await this.invalidateCacheKey(`pieza_${id}`)
    await this.invalidateCacheKey('all_piezas')
    return this.piezaMapper.toResponseDto(piezaUpdated)
  }

  /**
   * Esta función elimina un pieza por id pero es un borrado fisico por lo tanto el pieza desaparece de la base de datos y de cache
   * @param id
   */
  async remove(id: string) {
    this.logger.log(`Quitando pieza por el id:${id}`)
    const piezaToRemove = await this.exists(id)
    /*     this.WebsocketGateway.sendMessage(piezaToRemove)
     */ return await this.piezaRepository.remove(piezaToRemove)
  }

  /**
   * Esta función elimina un pieza por id pero es un borrado logico por lo tanto el pieza ya no se puede encontrar con el find pero sigue en la base de datos
   * Porque cambiamos el valor de isDeleted a true
   * @param id
   * @returns {Promise<Pieza>}
   */

  async removeSoft(id: string) {
    this.logger.log(`Quitar pieza de manera logica con id:${id}`)
    const piezaToRemove = await this.exists(id)
    piezaToRemove.isDeleted = true
    return await this.piezaRepository.save(piezaToRemove)
  }
  
  async exists(id: string) {
    const pieza = await this.piezaRepository.findOne({ where: { id } })

    if (!pieza) {
      this.logger.log(`pieza con id ${id} no encontrado`)
      throw new NotFoundException(`pieza con id ${id} no encontrado`)
    }

    return pieza
  }

  /**
   * Esta función comprueba si existe una categoria por nombre
   * @param nombreCategoria
   * @returns {Promise<Categoria>}




   * Esta función actualiza la imagen de un pieza por id
   * @param id
   * @param file
   * @param req
   * @param withUrl
   * @returns {Promise<PiezaResponseDto>}
   */
  /*  async updateImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = true,
  ) {
    this.logger.log(`Update image pieza by id:${id}`)
    const piezaToUpdate = await this.exists(id)

    if (piezaToUpdate.imagen !== Pieza.IMAGE_DEFAULT) {
      this.logger.log(`Deleting image ${piezaToUpdate.imagen}`)
      let imagePath = piezaToUpdate.imagen
      if (withUrl) {
        imagePath = this.storageService.getFileNameWithouUrl(
          piezaToUpdate.imagen,
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

    piezaToUpdate.imagen = filePath
    const piezaUpdated = await this.piezaRepository.save(piezaToUpdate)
    const dto = this.piezaMapper.toResponseDto(piezaUpdated)
    await this.invalidateCacheKey(`pieza_${id}`)
    await this.invalidateCacheKey('all_piezas')
    return dto
  }
 */
  /**
   * Esta función invalida una clave de cache
   * @param key
   */
  async invalidateCacheKey(key: string): Promise<void> {
    await this.cacheManager.del(key)
  }
}
