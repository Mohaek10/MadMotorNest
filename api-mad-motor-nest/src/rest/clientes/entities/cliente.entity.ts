import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'clientes' })
export class Cliente {
  public static IMAGEN_DEFAULT: string = 'https://via.placeholder.com/150'
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number
  @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
  nombre: string
  @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
  apellido: string
  @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
  direccion: string
  @Column({ type: 'integer', default: 10000 })
  codigoPostal: number
  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  dni: string
  @Column({ type: 'text', default: Cliente.IMAGEN_DEFAULT })
  imagen: string
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean
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
}
