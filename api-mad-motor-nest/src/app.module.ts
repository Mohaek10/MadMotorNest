import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { BbddModule } from './config/bbdd/bbdd.module'

@Module({
  imports: [ConfigModule.forRoot(), BbddModule, CategoriasModule],
})
export class AppModule {}
