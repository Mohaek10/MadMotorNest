import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './entities/user.entity'
import { UserRole } from './entities/user-role.entity'
import { UsuariosMapper } from './mappers/usuarios.mapper'
import { CacheModule } from '@nestjs/cache-manager'
import { BcryptService } from './bcrypt.service'
import { PedidosModule } from '../pedidos/pedidos.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([UserRole]),
    CacheModule.register(),
    PedidosModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsuariosMapper, BcryptService],
  exports: [UsersService],
})
export class UsersModule {}
