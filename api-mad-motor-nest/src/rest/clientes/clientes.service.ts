import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {CreateClienteDto} from './dto/create-cliente.dto';
import {UpdateClienteDto} from './dto/update-cliente.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Cliente} from "./entities/cliente.entity";
import {Repository} from "typeorm";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {ClientesMapper} from "./mapper/clientes.mapper";
import {FilterOperator, FilterSuffix, paginate, PaginateQuery} from "nestjs-paginate";

@Injectable()
export class ClientesService {
  private readonly logger: Logger = new Logger(ClientesService.name);
  constructor(
     @InjectRepository(Cliente)
     private readonly clienteRepository: Repository<Cliente>,
     @Inject(CACHE_MANAGER) private cacheManager: Cache,
     private readonly mapper: ClientesMapper,
  ) {}
  async create(createClienteDto: CreateClienteDto) {
    this.logger.log('Guardando cliente en la base de datos');
    const existe = await this.clienteRepository.findOne({where: {dni: createClienteDto.dni}});
    if(existe){
        throw new NotFoundException(`Ya existe un cliente con dni: ${createClienteDto.dni} en la base de datos`);
    }else {
      const newCliente= this.mapper.toCliente(createClienteDto);
      const cliente = await this.clienteRepository.save(newCliente);
      return this.mapper.toClienteResponse(cliente);
    }
  }
  async findAll(query: PaginateQuery) {
    this.logger.log(`Buscando Clientes con query ${JSON.stringify(query)} `);
    const result= await paginate(query, this.clienteRepository,{
      sortableColumns: ['nombre', 'apellido', 'direccion',"codigoPostal"],
      defaultSortBy: [['nombre', 'DESC']],
      searchableColumns: ['nombre', 'apellido', 'direccion',"codigoPostal"],
      filterableColumns:{
        nombre: [FilterOperator.EQ,FilterSuffix.NOT],
        apellido: [FilterOperator.EQ,FilterSuffix.NOT],
        direccion: [FilterOperator.EQ,FilterSuffix.NOT],
        codigoPostal: [FilterOperator.EQ,FilterSuffix.NOT],
      }
    });
    return result;
  }
  async findOne(id: string) {
    this.logger.log(`Buscando cliente con dni ${id}`)
    const cliente= await this.searchByDni(id);
    return this.mapper.toClienteResponse(cliente);
  }
  async update(id: string, updateClienteDto: UpdateClienteDto) {
    this.logger.log(`Actualizando cliente con dni ${id}`)
    const toUpdate= await this.searchByDni(id);
    this.logger.log(`Empezando a actualizar cliente ${JSON.stringify(toUpdate)}`);
    const update= this.mapper.toClienteUpdate(updateClienteDto, toUpdate);
    this.logger.log(`Cliente actualizado ${JSON.stringify(update)}`);
    const cliente= await this.clienteRepository.save(update);
    return this.mapper.toClienteResponse(cliente);
  }

  async remove(id: string) {
    this.logger.log(`Eliminando cliente con dni ${id}`)
    const toDelete= await this.searchByDni(id);
    this.logger.log(`Empezando a eliminar cliente ${JSON.stringify(toDelete)}`);
    const cliente= await this.clienteRepository.remove(toDelete);
    this.logger.log(`Cliente eliminado`);
    return this.mapper.toClienteResponse(cliente);
  }

  async searchByDni(dni: string) {
    this.logger.log(`Buscando cliente con dni ${dni}`);
    const exits= await this.clienteRepository.findOne({where: {dni: dni}});
    if(exits){
      this.logger.log(`Cliente con dni ${dni} encontrado`);
        return exits;
    } else {
      throw new NotFoundException(`No existe el cliente con dni ${dni}`);
    }
  }
}
