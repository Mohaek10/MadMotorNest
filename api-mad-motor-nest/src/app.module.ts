import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { DatabaseModule } from './config/database/database.module'
import { VehiculosModule } from './rest/vehiculos/vehiculos.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriasModule,
    VehiculosModule,
  ],
})
export class AppModule {}
