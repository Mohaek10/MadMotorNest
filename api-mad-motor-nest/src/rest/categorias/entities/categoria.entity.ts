import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity'

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.categoria)
  vehiculos: Vehiculo[]
}
