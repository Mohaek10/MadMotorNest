import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'personal' })
export class Personal {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string
  @Column({ type: 'varchar', length: 100, nullable: false })
  apellidos: string
  @Column({ type: 'varchar', length: 9, nullable: false })
  dni: string
  @Column({ type: 'date', nullable: false })
  fechaNacimiento: string
  @Column({ type: 'varchar', length: 200, nullable: false })
  direccion: string

  @Column({ type: 'varchar', length: 12, nullable: false })
  telefono: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string

  @Column({ type: 'double precision', default: 1000.0, nullable: false })
  sueldo: number

  @Column({ type: 'varchar', length: 20, nullable: false })
  iban: string

  //CreateDate
  // UpdateDate
  // IsBoolean
}
