import { Module } from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CategoriasController } from './categorias.controller'
import { CategoriasMapper } from './mappers/categorias.mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from './entities/categoria.entity'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [TypeOrmModule.forFeature([Categoria]), CacheModule.register()],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasMapper],
})
export class CategoriasModule {}
