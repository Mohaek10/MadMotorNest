import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

@Entity('piezas')
export class Pieza {
  public static IMAGE_DEFAULT = 'default.png'
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string
  @Column({ type: 'varchar', length: 50, nullable: false })
  descripcion: string
  @Column({ type: 'decimal', length: 50, nullable: false })
  precio: number
  @Column({ type: 'int', length: 50, nullable: false })
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
