import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Entity } from 'typeorm/decorator/entity/Entity'

@Entity('pieza')
export class Pieza {
  public static IMAGE_DEFAULT = 'https://i.imgur.com/5NkZ5rJ.png'
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column('varchar', { length: 100, nullable: false, name: 'nombre' })
  nombre: string
  @Column('decimal', { nullable: false, name: 'precio' })
  precio: number
  @Column('varchar', { length: 100, nullable: false, name: 'descripcion' })
  descripcion: string
  @Column('int', { nullable: false, name: 'cantidad' })
  cantidad: number
  @Column({ type: 'text', default: Pieza.IMAGE_DEFAULT })
  imagen: string
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean
}
