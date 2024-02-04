import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Pedido, PedidoDocument } from './schemas/pedido.schema'
import { PaginateModel } from 'mongoose'
import { InjectRepository } from '@nestjs/typeorm'
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity'
import { Repository } from 'typeorm'
import { Usuario } from '../../users/entities/user.entity'
import { Pieza } from '../pieza/entities/pieza.entity'
import { PedidosMapper } from './mappers/pedidos.mapper'

@Injectable()
export class PedidosService {
  private logger = new Logger(PedidosService.name)

  constructor(
    @InjectModel(Pedido.name)
    private pedidoRepo: PaginateModel<PedidoDocument>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepo: Repository<Vehiculo>,
    @InjectRepository(Pieza)
    private readonly piezaRepo: Repository<Pieza>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly pedidoMapper: PedidosMapper,
  ) {}
  async findAll(page: number, limit: number, orderBy: string, order: string) {
    this.logger.log(`
    Buscando todos los pedidos con paginacion y filtros: ${JSON.stringify({
      page,
      limit,
      orderBy,
      order,
    })}
    `)
    const options = {
      page,
      limit,
      sort: {
        [orderBy]: order,
      },
      collection: 'es_ES',
    }
    return await this.pedidoRepo.paginate({}, options)
  }

  async findOne(id: string) {
    this.logger.log(`Buscando pedidos con el id ${id}`)
    const pedido = await this.pedidoRepo.findById(id).exec()
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }
    return pedido
  }

  async findByIdUsuario(idUsuario: number) {
    this.logger.log(`Buscando por usuario con id : ${idUsuario}`)
    return await this.pedidoRepo.find({ idUsuario }).exec()
  }

  async create(createPedidoDto: CreatePedidoDto) {
    return 'This action adds a new pedido'
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`
  }
  private async comprobarPedido(pedido: Pedido) {
    this.logger.log(`Comprobando pedido: ${JSON.stringify(pedido)}`)
    if (!pedido.lineasDePedido || pedido.lineasDePedido.length === 0) {
      throw new BadRequestException('El pedido no tiene lineas de pedido')
    }
    for (const linea of pedido.lineasDePedido) {
    }
  }
}
