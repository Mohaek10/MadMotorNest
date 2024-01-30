import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { DatabaseModule } from './config/database/database.module'
import { VehiculosModule } from './rest/vehiculos/vehiculos.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ClientesModule } from './rest/clientes/clientes.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CacheModule.register(),
    CategoriasModule,
    VehiculosModule,
    ClientesModule,
  ],
})
export class AppModule {}
