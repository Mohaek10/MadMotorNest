import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Cliente} from "./entities/cliente.entity";
import {CacheModule} from "@nestjs/cache-manager";
import {ClientesMapper} from "./mapper/clientes.mapper";

@Module({
  imports:[TypeOrmModule.forFeature([Cliente]),CacheModule.register()],
  controllers: [ClientesController],
  providers: [ClientesService,ClientesMapper],
})
export class ClientesModule {}
