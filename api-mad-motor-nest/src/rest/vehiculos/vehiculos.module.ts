import { Module } from '@nestjs/common'
import { VehiculosService } from './vehiculos.service'
import { VehiculosController } from './vehiculos.controller'
import { VehiculoMapper } from './mappers/vehiculo-mapper'

@Module({
  controllers: [VehiculosController],
  providers: [VehiculosService, VehiculoMapper],
})
export class VehiculosModule {}
