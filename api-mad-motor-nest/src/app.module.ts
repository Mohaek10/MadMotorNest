import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { DatabaseModule } from './config/database/database.module'
import { VehiculosModule } from './rest/vehiculos/vehiculos.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ClientesModule } from './rest/clientes/clientes.module'
import { StorageModule } from './rest/storage/storage.module'
import { PiezaModule } from './rest/pieza/pieza.module'
import {UsersModule} from "./rest/users/users.module";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CacheModule.register(),
    CategoriasModule,
    VehiculosModule,
    ClientesModule,
    StorageModule,
    PiezaModule,
      UsersModule,
      AuthModule,
  ],
})
export class AppModule {}
