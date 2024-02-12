import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'personal' })
export class Personal {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', nullable: false })
  nombre: string
  @Column({ type: 'varchar', nullable: false })
  apellidos: string
  @Column({ type: 'varchar', nullable: false })
  dni: string
  @Column({ type: 'varchar', nullable: false })
  fechaNacimiento: string
  @Column({ type: 'varchar', nullable: false })
  direccion: string

  @Column({ type: 'varchar', nullable: false })
  telefono: string

  @Column({ type: 'varchar', nullable: false })
  email: string

  @Column({ type: 'varchar', default: 1000.0, nullable: false })
  sueldo: number

  @Column({ type: 'varchar', nullable: false })
  iban: string

  //CreateDate
  // UpdateDate
  // IsBoolean
}
