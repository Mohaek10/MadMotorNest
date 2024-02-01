import { Module } from '@nestjs/common';
import { PiezaService } from './pieza.service';
import { PiezaController } from './pieza.controller';
import { PiezaMapper } from './mappers/pieza-mapper';
import {CacheModule} from "@nestjs/cache-manager";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Vehiculo} from "../vehiculos/entities/vehiculo.entity";
import {Pieza} from "./entities/pieza.entity";

@Module({
  imports:[
    TypeOrmModule.forFeature([Pieza]),

    CacheModule.register(),
  ],

  controllers: [PiezaController],
  providers: [PiezaService, PiezaMapper],
})
export class PiezaModule {

}
