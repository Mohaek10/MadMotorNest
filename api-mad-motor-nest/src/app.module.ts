import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { DatabaseModule } from './config/database/database.module'
import { VehiculosModule } from './rest/vehiculos/vehiculos.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ClientesModule } from './rest/clientes/clientes.module'
import { StorageModule } from './rest/storage/storage.module'
import { PiezaModule } from './rest/pieza/pieza.module'
import { NotificationModule } from './notification/notification.module'
import { AuthModule } from './rest/auth/auth.module'
import { UsersModule } from './rest/users/users.module'
import { PedidosModule } from './rest/pedidos/pedidos.module'
import * as process from 'process'
import { CorsConfigModule } from './config/cors/cors.module'
import { PersonalModule } from './rest/personal/personal.module'

@Module({
  imports: [
    ConfigModule.forRoot(
      process.env.NODE_ENV === 'dev'
        ? { envFilePath: '.env' }
        : { envFilePath: '.env.prod' },
    ),
    CorsConfigModule,
    DatabaseModule,
    CacheModule.register(),
    NotificationModule,
    CategoriasModule,
    VehiculosModule,
    ClientesModule,
    StorageModule,
    PiezaModule,
    PersonalModule,
    PedidosModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
