import { ClientesMapper } from './clientes.mapper'
import { Test, TestingModule } from '@nestjs/testing'
import { CreateClienteDto } from '../dto/create-cliente.dto'
import { Cliente } from '../entities/cliente.entity'
import { UpdateClienteDto } from '../dto/update-cliente.dto'

describe('ClientesMapper', () => {
  let mapper: ClientesMapper
  const createClienteDto = (): CreateClienteDto => {
    const create = new CreateClienteDto()
    create.nombre = 'test'
    create.apellido = 'test'
    create.direccion = 'test'
    create.codigoPostal = 12345
    create.dni = '12345678A'
    return create
  }
  const testEntidad = (): Cliente => {
    const cliente = new Cliente()
    cliente.id = 1
    cliente.nombre = 'test'
    cliente.apellido = 'test'
    cliente.codigoPostal = 12345
    cliente.direccion = 'test'
    cliente.dni = '12345678A'
    return cliente
  }
  const testUpdateDto = (): UpdateClienteDto => {
    const create = new UpdateClienteDto()
    create.nombre = 'test'
    create.apellido = 'test'
    create.direccion = 'test'
    create.codigoPostal = 12345
    create.dni = '12345678A'
    return create
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientesMapper],
    }).compile()
    mapper = module.get<ClientesMapper>(ClientesMapper)
  })
  it('should be defined', () => {
    expect(mapper).toBeDefined()
  })
  describe('toEntity', () => {
    it('good case', () => {
      const createCliente = createClienteDto()
      const clienteentity = mapper.toCliente(createCliente)
      expect(clienteentity.nombre).toEqual(createCliente.nombre)
      expect(clienteentity.apellido).toEqual(createCliente.apellido)
      expect(clienteentity.direccion).toEqual(createCliente.direccion)
      expect(clienteentity.codigoPostal).toEqual(createCliente.codigoPostal)
      expect(clienteentity.dni).toEqual(createCliente.dni)
    })
    it('should return default image', () => {
      const createCliente = createClienteDto()
      createCliente.imagen = undefined
      const clienteentity = mapper.toCliente(createCliente)
      expect(clienteentity.imagen).toEqual(ClientesMapper.IMAGEN_DEFAULT)
    })
    it('should return custom image', () => {
      const createCliente = createClienteDto()
      createCliente.imagen = 'test'
      const clienteentity = mapper.toCliente(createCliente)
      expect(clienteentity.imagen).toEqual(createCliente.imagen)
    })
  })
  describe('toClienteUpdate', () => {
    it('good case', () => {
      const updateCliente = testUpdateDto()
      const cliente = testEntidad()
      const clienteentity = mapper.toClienteUpdate(updateCliente, cliente)
      expect(clienteentity.nombre).toEqual(updateCliente.nombre)
      expect(clienteentity.apellido).toEqual(updateCliente.apellido)
      expect(clienteentity.direccion).toEqual(updateCliente.direccion)
      expect(clienteentity.codigoPostal).toEqual(updateCliente.codigoPostal)
      expect(clienteentity.dni).toEqual(updateCliente.dni)
    })
    it('should return default image', () => {
      const updateCliente = testUpdateDto()
      const cliente = testEntidad()
      updateCliente.imagen = undefined
      const clienteentity = mapper.toClienteUpdate(updateCliente, cliente)
      expect(clienteentity.imagen).toEqual(cliente.imagen)
    })
    it('should return custom image', () => {
      const updateCliente = testUpdateDto()
      const cliente = testEntidad()
      updateCliente.imagen = 'test'
      const clienteentity = mapper.toClienteUpdate(updateCliente, cliente)
      expect(clienteentity.imagen).toEqual(updateCliente.imagen)
    })
  })
  describe('toClienteResponse', () => {
    it('good case', () => {
      const cliente = testEntidad()
      const clienteResponse = mapper.toClienteResponse(cliente)
      expect(clienteResponse.nombre).toEqual(cliente.nombre)
      expect(clienteResponse.apellido).toEqual(cliente.apellido)
      expect(clienteResponse.direccion).toEqual(cliente.direccion)
      expect(clienteResponse.codigoPostal).toEqual(cliente.codigoPostal)
      expect(clienteResponse.dni).toEqual(cliente.dni)
    })
  })
  describe('toClienteInfoDto', () => {
    it('good case', () => {
      const cliente = testEntidad()
      const clienteInfo = mapper.toClienteInfoDto(cliente)
      expect(clienteInfo.nombre).toEqual(cliente.nombre)
      expect(clienteInfo.apellido).toEqual(cliente.apellido)
      expect(clienteInfo.dni).toEqual(cliente.dni)
    })
  })
})
