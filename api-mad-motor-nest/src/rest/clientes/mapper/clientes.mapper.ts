import { Injectable } from '@nestjs/common'
import { CreateClienteDto } from '../dto/create-cliente.dto'
import { Cliente } from '../entities/cliente.entity'
import { UpdateClienteDto } from '../dto/update-cliente.dto'
import { ResponseClienteDto } from '../dto/response-cliente.dto'
import { ClienteInfo } from '../dto/cliente.info'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ClientesMapper {
  public static IMAGEN_DEFAULT: string = 'https://via.placeholder.com/150'
  toCliente(clienteDto: CreateClienteDto): Cliente {
    const cliente = plainToClass(Cliente, clienteDto)
    cliente.imagen = clienteDto.imagen ?? ClientesMapper.IMAGEN_DEFAULT
    return cliente
  }
  toClienteUpdate(
    clienteUpdateDto: UpdateClienteDto,
    cliente: Cliente,
  ): Cliente {
    const updatedCliente = {
      ...cliente,
      ...clienteUpdateDto,
      imagen: clienteUpdateDto.imagen ?? cliente.imagen,
    }
    return updatedCliente
  }
  toClienteResponse(cliente: Cliente): ResponseClienteDto {
    const response = plainToClass(ResponseClienteDto, cliente)
    return response
  }
  toClienteInfoDto(cliente: Cliente): ClienteInfo {
    const clienteInfo = plainToClass(ClienteInfo, cliente)
    return clienteInfo
  }
}
