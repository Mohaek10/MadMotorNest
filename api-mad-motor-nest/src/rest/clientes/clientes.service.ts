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
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'

@Injectable()
export class ClientesService {
  private readonly logger: Logger = new Logger(ClientesService.name)
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mapper: ClientesMapper,
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
      return this.mapper.toClienteResponse(cliente)
    }
  }
  async findAll(query: PaginateQuery) {
    this.logger.log(`Buscando Clientes con query ${JSON.stringify(query)} `)
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
    return result
  }
  async findOne(id: number) {
    this.logger.log(`Buscando cliente con id ${id}`)
    const cliente = await this.searchById(id)
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
    return this.mapper.toClienteResponse(cliente)
  }

  async remove(id: number) {
    this.logger.log(`Eliminando cliente con id ${id}`)
    const toDelete = await this.searchById(id)
    this.logger.log(`Empezando a eliminar cliente ${JSON.stringify(toDelete)}`)
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
}
