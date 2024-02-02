import { UUID } from 'crypto'

export class ResponsePiezaDto {
  id: UUID
  nombre: string
  descripcion: string
  imagen: string
  precio: number
  stock: number
  isDeleted: boolean
}
