import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common'
import { PersonalService } from './personal.service'
import { CreatePersonalDto } from './dto/create-personal.dto'
import { UpdatePersonalDto } from './dto/update-personal.dto'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import { ApiTags } from '@nestjs/swagger'

@Controller('personal')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@ApiTags('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  @Roles('ADMIN')
  @HttpCode(201)
  async create(@Body() createPersonalDto: CreatePersonalDto) {
    return await this.personalService.create(createPersonalDto)
  }

  @CacheKey('all_personal')
  @CacheTTL(30)
  @Get()
  @Roles('USER')
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.personalService.findAll(query)
  }

  @Get(':id')
  @Roles('USER')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.personalService.findOne(id)
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: number,
    @Body() updatePersonalDto: UpdatePersonalDto,
  ) {
    return await this.personalService.update(+id, updatePersonalDto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: number) {
    return await this.personalService.remove(+id)
  }
}
