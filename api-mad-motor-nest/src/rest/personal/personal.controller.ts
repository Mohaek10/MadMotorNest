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
} from '@nestjs/common'
import { PersonalService } from './personal.service'
import { CreatePersonalDto } from './dto/create-personal.dto'
import { UpdatePersonalDto } from './dto/update-personal.dto'
import { Paginate, PaginateQuery } from 'nestjs-paginate'

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createPersonalDto: CreatePersonalDto) {
    return await this.personalService.create(createPersonalDto)
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.personalService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.personalService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePersonalDto: UpdatePersonalDto,
  ) {
    return await this.personalService.update(+id, updatePersonalDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.personalService.remove(+id)
  }
}
