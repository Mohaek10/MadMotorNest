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
    this.logger.log(`Creando pedido: ${JSON.stringify(createPedidoDto)}`)
    const id = createPedidoDto.idUsuario
    const usuario = await this.usuarioRepo.findOneBy({ id })
    if (!usuario) {
      throw new BadRequestException(`El usuario con id ${id} no existe`)
    }
    const pedido = this.pedidoMapper.toPedido(createPedidoDto)
    await this.comprobarPedido(pedido)
    await this.restarStock(pedido)
    return await this.pedidoRepo.create(pedido)
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    this.logger.log(`Actualizando pedido con id ${id}`)
    const buscarPedido = this.pedidoRepo.findById(id).exec()
    if (!buscarPedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }
    const pedido = this.pedidoMapper.toPedido(updatePedidoDto)
    await this.devolverStock(pedido)
    await this.comprobarPedido(pedido)
    await this.restarStock(pedido)
    pedido.updatedAt = new Date()
    return await this.pedidoRepo
      .findByIdAndUpdate(id, pedido, { new: true })
      .exec()
  }

  remove(id: string) {
    return `This action removes a #${id} pedido`
  }

  private async comprobarPedido(pedido: Pedido) {
    this.logger.log(`Comprobando pedido: ${JSON.stringify(pedido)}`)
    if (!pedido.lineasDePedido || pedido.lineasDePedido.length === 0) {
      this.logger.log(
        ` El pedido no tiene lineas de pedido ${pedido.lineasDePedido}`,
      )
      throw new BadRequestException('El pedido no tiene lineas de pedido')
    }
    for (const linea of pedido.lineasDePedido) {
      if (linea.idVehiculo) {
        const id = linea.idVehiculo
        const vehiculo = await this.vehiculoRepo.findOneBy({ id })
        if (!vehiculo) {
          throw new BadRequestException(
            `El vehiculo con id ${linea.idVehiculo} no existe`,
          )
        }
        const precioVehiculo: number = Number(vehiculo.precio)
        const precioLinea: number = Number(linea.precioVehiculo)

        if (linea.cantidadVehiculo > vehiculo.stock) {
          throw new BadRequestException(
            `No hay suficiente stock para el vehiculo con id ${linea.idVehiculo}`,
          )
        }
        if (precioVehiculo !== precioLinea) {
          this.logger.log(
            `El precio del vehiculo con id ${linea.idVehiculo} no coincide y su precio es ${vehiculo.precio} \n y el precio de la linea es ${linea.precioVehiculo} y el precio es ${vehiculo.precio}`,
          )
          this.logger.log(
            `${linea.precioVehiculo.valueOf()} y ${vehiculo.precio.valueOf()}`,
          )
          throw new BadRequestException(
            `El precio del vehiculo con id ${linea.idVehiculo} no coincide`,
          )
        }
      }
      if (linea.idPieza) {
        const id = linea.idPieza
        const pieza = await this.piezaRepo.findOne({ where: { id } })
        if (!pieza) {
          throw new BadRequestException(
            `La pieza con id ${linea.idPieza} no existe`,
          )
        }
        if (linea.cantidadPieza > pieza.cantidad) {
          throw new BadRequestException(
            `No hay suficiente stock para la pieza con id ${linea.idPieza}`,
          )
        }
        if (linea.precioPieza !== pieza.precio) {
          throw new BadRequestException(
            `El precio de la pieza con id ${linea.idPieza} no coincide`,
          )
        }
      }
    }
  }

  private async restarStock(pedido: Pedido) {
    this.logger.log(`Restando stock del pedido: ${JSON.stringify(pedido)}`)
    for (const linea of pedido.lineasDePedido) {
      if (linea.idVehiculo) {
        const id = linea.idVehiculo
        const vehiculo = await this.vehiculoRepo.findOneBy({ id })
        const precioVehiculo: number = Number(vehiculo.precio)
        this.logger.log(`Restando stock del vehiculo con id ${id}`)
        vehiculo.stock -= linea.cantidadVehiculo
        await this.vehiculoRepo.save(vehiculo)
        this.logger.log(
          `Calculando precio de la linea${typeof linea.cantidadVehiculo} ${typeof precioVehiculo} ${typeof linea.precioVehiculo}`,
        )
        linea.precioVehiculo = precioVehiculo * linea.cantidadVehiculo
      }
      if (linea.idPieza) {
        const id = linea.idPieza
        const pieza = await this.piezaRepo.findOne({ where: { id } })
        pieza.cantidad -= linea.cantidadPieza
        await this.piezaRepo.save(pieza)
        linea.precioPieza = pieza.precio * linea.cantidadPieza
      }
      if (linea.idVehiculo && linea.idPieza) {
        linea.precioTotal = linea.precioVehiculo + linea.precioPieza
      } else if (linea.idVehiculo) {
        linea.precioTotal = linea.precioVehiculo
      } else if (linea.idPieza) {
        linea.precioTotal = linea.precioPieza
      }
    }
    pedido.totalPedido = pedido.lineasDePedido.reduce(
      (acc, linea) => acc + linea.precioTotal,
      0,
    )
  }

  private async devolverStock(pedido: Pedido) {
    this.logger.log(`Devolviendo stock del pedido: ${JSON.stringify(pedido)}`)
    for (const linea of pedido.lineasDePedido) {
      if (linea.idVehiculo) {
        const id = linea.idVehiculo
        const vehiculo = await this.vehiculoRepo.findOneBy({ id })
        vehiculo.stock += linea.cantidadVehiculo
        await this.vehiculoRepo.save(vehiculo)
      }
      if (linea.idPieza) {
        const id = linea.idPieza
        const pieza = await this.piezaRepo.findOne({ where: { id } })
        pieza.cantidad += linea.cantidadPieza
        await this.piezaRepo.save(pieza)
      }
    }
  }
}
