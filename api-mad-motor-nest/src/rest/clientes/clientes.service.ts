import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateClienteDto } from './dto/create-cliente.dto'
import { UpdateClienteDto } from './dto/update-cliente.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Cliente } from './entities/cliente.entity'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ClientesMapper } from './mapper/clientes.mapper'
import { Request } from 'express'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'
import { ResponseClienteDto } from './dto/response-cliente.dto'
import { StorageService } from '../storage/storage.service'
import process from 'process'

@Injectable()
export class ClientesService {
  private readonly logger: Logger = new Logger(ClientesService.name)
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mapper: ClientesMapper,
    private readonly storageService: StorageService,
  ) {}
  async create(createClienteDto: CreateClienteDto) {
    this.logger.log('Guardando cliente en la base de datos')
    const existe = await this.clienteRepository.findOne({
      where: { dni: createClienteDto.dni },
    })
    if (existe) {
      throw new BadRequestException(
        `Ya existe un cliente con dni: ${createClienteDto.dni} en la base de datos`,
      )
    } else {
      const newCliente = this.mapper.toCliente(createClienteDto)
      const cliente = await this.clienteRepository.save(newCliente)
      await this.cacheManager.del('all_clientes')
      return this.mapper.toClienteResponse(cliente)
    }
  }
  async findAll(query: PaginateQuery) {
    this.logger.log(`Buscando Clientes con query ${JSON.stringify(query)} `)
    const cache = await this.cacheManager.get(
      `all_clientes_page_${hash(JSON.stringify(query))}`,
    )

    if (cache) {
      this.logger.log('clientes encontrados en cache')
      return cache
    }

    const result = await paginate(query, this.clienteRepository, {
      sortableColumns: ['nombre', 'apellido', 'direccion', 'codigoPostal'],
      defaultSortBy: [['nombre', 'DESC']],
      searchableColumns: ['nombre', 'apellido', 'direccion', 'codigoPostal'],
      filterableColumns: {
        nombre: [FilterOperator.EQ, FilterSuffix.NOT],
        apellido: [FilterOperator.EQ, FilterSuffix.NOT],
        direccion: [FilterOperator.EQ, FilterSuffix.NOT],
        codigoPostal: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    })
    await this.cacheManager.set(
      `all_clientes_page_${hash(JSON.stringify(query))}`,
      result,
      60,
    )
    return result
  }
  async findOne(id: number) {
    this.logger.log(`Buscando cliente con id ${id}`)
    const cache: ResponseClienteDto = await this.cacheManager.get(
      `clientes_${id}`,
    )
    if (cache) {
      this.logger.log(`cliente con id ${id} encontrado en cache`)
      return cache
    }
    const cliente = await this.searchById(id)
    await this.cacheManager.set(`clientes_${id}`, cliente, 60)
    return this.mapper.toClienteResponse(cliente)
  }
  async update(id: number, updateClienteDto: UpdateClienteDto) {
    this.logger.log(`Actualizando cliente con id ${id}`)
    const toUpdate = await this.searchById(id)
    this.logger.log(
      `Empezando a actualizar cliente ${JSON.stringify(toUpdate)}`,
    )
    const update = this.mapper.toClienteUpdate(updateClienteDto, toUpdate)
    this.logger.log(`Cliente actualizado ${JSON.stringify(update)}`)
    const cliente = await this.clienteRepository.save(update)
    await this.cacheManager.del('all_clientes')
    await this.cacheManager.del(`clientes_${id}`)
    return this.mapper.toClienteResponse(cliente)
  }

  async remove(id: number) {
    this.logger.log(`Eliminando cliente con id ${id}`)
    const toDelete = await this.searchById(id)
    this.logger.log(`Empezando a eliminar cliente ${JSON.stringify(toDelete)}`)
    await this.cacheManager.del('all_clientes')
    await this.cacheManager.del(`clientes_${id}`)
    const cliente = await this.clienteRepository.remove(toDelete)
    this.logger.log(`Cliente eliminado`)
    return this.mapper.toClienteResponse(cliente)
  }

  async searchById(id: number) {
    this.logger.log(`Buscando cliente con id ${id}`)
    const exits = await this.clienteRepository.findOne({ where: { id: id } })
    if (exits) {
      this.logger.log(`Cliente con id ${id} encontrado`)
      return exits
    } else {
      throw new NotFoundException(`No existe el cliente con id ${id}`)
    }
  }
  public async updateImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = true,
  ) {
    this.logger.log(`Actualizando imagen de cliente con id ${id}`)
    const cliente = await this.searchById(id)
    if (cliente.imagen !== Cliente.IMAGEN_DEFAULT) {
      this.logger.log('Cliente actualizado imagen')
      const imageName = cliente.imagen
      try {
        this.storageService.borraFichero(imageName)
      } catch (e) {
        this.logger.log('No se pudo eliminar imagen anterior')
        throw new BadRequestException(e.message)
      }
    }
    if (!file) {
      throw new BadRequestException('No se ha subido ninguna imagen')
    }
    let filePath: string

    if (withUrl) {
      this.logger.log('Generando Url')
      const version = process.env.API_VERSION
        ? `/${process.env.API_VERSION}`
        : 'v1'
      filePath = `${req.protocol}://${req.get('host')}${version}/storage/${file.filename}`
    } else {
      filePath = file.filename
    }
    cliente.imagen = filePath
    this.logger.log(`Imagen actualizada ${filePath}`)
    await this.clienteRepository.save(cliente)
    await this.cacheManager.del('all_clientes')
    cliente.imagen = filePath
    return this.mapper.toClienteResponse(cliente)
  }
}
