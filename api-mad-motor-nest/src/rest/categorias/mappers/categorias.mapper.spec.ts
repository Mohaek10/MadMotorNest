import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasMapper } from './categorias.mapper'
import { CreateCategoriaDto } from '../dto/create-categoria.dto'
import { Categoria } from '../entities/categoria.entity'
import { UpdateCategoriaDto } from '../dto/update-categoria.dto'

describe('CategoriasMapper', () => {
  let provider: CategoriasMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriasMapper],
    }).compile()
    provider = module.get<CategoriasMapper>(CategoriasMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  it('should map CreateCategoriaDto to CategoriaEntity', () => {
    const createCategoriaDto: CreateCategoriaDto = {
      nombre: 'Marvel',
    }

    const expectedCategoria: Categoria = {
      id: 'b71661f5-efd8-412f-986d-88f4123a4242',
      nombre: 'Marvel',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      vehiculos: [],
    }

    const actualCategoria: Categoria =
      provider.mapCreateDtotoEntity(createCategoriaDto)

    expect(actualCategoria.nombre).toEqual(expectedCategoria.nombre)
  })

  it('should map UpdateCategoriaDto to CategoriaEntity', () => {
    const updateCategoriaDto: UpdateCategoriaDto = {
      nombre: 'Marvel',
    }

    const expectedCategoria: Categoria = {
      id: 'b71661f5-efd8-412f-986d-88f4123a4242',
      nombre: 'Marvel',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: true,
      vehiculos: [],
    }

    const actualCategoria: Categoria =
      provider.mapCreateDtotoEntity(updateCategoriaDto)

    expect(actualCategoria.nombre).toEqual(expectedCategoria.nombre)
  })
})
