import { Module } from '@nestjs/common';
import { PiezasService } from './piezas.service';
import { PiezasController } from './piezas.controller';
import { Piezasmapper } from './piezasmapper/piezasmapper';

@Module({
  controllers: [PiezasController],
  providers: [PiezasService, Piezasmapper],
})
export class PiezasModule {}
