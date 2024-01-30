import { Module } from '@nestjs/common'
import { VehiculosService } from './vehiculos.service'
import { VehiculosController } from './vehiculos.controller'
import { VehiculoMapper } from './mappers/vehiculo-mapper'
import { Vehiculo } from './entities/vehiculo.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from '../categorias/entities/categoria.entity'
import { CacheModule } from '@nestjs/cache-manager'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehiculo]),
    TypeOrmModule.forFeature([Categoria]),
    CacheModule.register(),
    StorageModule,
  ],
  controllers: [VehiculosController],
  providers: [VehiculosService, VehiculoMapper],
})
export class VehiculosModule {}
