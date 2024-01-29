import { Module } from '@nestjs/common'
import { VehiculosService } from './vehiculos.service'
import { VehiculosController } from './vehiculos.controller'
import { VehiculoMapper } from './mappers/vehiculo-mapper'
import { Vehiculo } from './entities/vehiculo.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from '../categorias/entities/categoria.entity'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehiculo]),
    TypeOrmModule.forFeature([Categoria]),
    CacheModule.register(),
  ],
  controllers: [VehiculosController],
  providers: [VehiculosService, VehiculoMapper],
})
export class VehiculosModule {}
