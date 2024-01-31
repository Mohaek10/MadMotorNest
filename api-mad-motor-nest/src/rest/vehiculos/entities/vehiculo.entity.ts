import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Categoria } from '../../categorias/entities/categoria.entity'

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: 100 })
  marca: string

  @Column({ type: 'varchar', length: 100 })
  modelo: string

  @Column({ type: 'number' })
  year: number

  @Column({ type: 'number' })
  km: number

  @Column({ type: 'number' })
  precio: number

  @Column({ type: 'number' })
  stock: number

  @Column({ type: 'varchar', default: 'https://picsum.photos/200' })
  image: string

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean

  @ManyToOne(() => Categoria, (categoria) => categoria.vehiculos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria
}
