import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './categorias/categorias.module'
import { BbddModule } from './configuracion/bbdd/bbdd.module'

@Module({
  imports: [ConfigModule.forRoot(), BbddModule, CategoriasModule],
})
export class AppModule {}
