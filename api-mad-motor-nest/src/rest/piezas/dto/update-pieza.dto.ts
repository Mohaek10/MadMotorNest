import { PartialType } from '@nestjs/mapped-types'
import { CreatePiezaDto } from './create-pieza.dto'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdatePiezaDto extends PartialType(CreatePiezaDto) {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  nombre?: string
  @IsNumber()
  @IsOptional()
  precio?: number
  @IsNumber()
  @IsOptional()
  cantidad?: number
  @IsString()
  @IsOptional()
  imagen?: string
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean
}
