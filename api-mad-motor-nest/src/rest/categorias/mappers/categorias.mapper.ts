import { Injectable } from '@nestjs/common'
import { Categoria } from '../entities/categoria.entity'
import { plainToClass } from 'class-transformer'
import { CreateCategoriaDto } from '../dto/create-categoria.dto'
import { UpdateCategoriaDto } from '../dto/update-categoria.dto'

@Injectable()
export class CategoriasMapper {
  mapCreateDtotoEntity(
    createCategoriaDto: CreateCategoriaDto | UpdateCategoriaDto,
  ): Categoria {
    return plainToClass(Categoria, createCategoriaDto)
  }
}
