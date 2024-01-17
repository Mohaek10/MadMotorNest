import { Module } from '@nestjs/common';
import { VehiculosModule } from './rest/vehiculos/vehiculos.module';

@Module({
  imports: [VehiculosModule],
})
export class AppModule {}
