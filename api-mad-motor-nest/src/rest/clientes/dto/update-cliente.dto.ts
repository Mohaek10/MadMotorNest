import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import {
    IsBoolean,
    IsOptional,
    IsPostalCode,
    IsString,
    Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
    nombre: string;
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
    apellido: string;
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
    direccion: string;
    @IsOptional()
    @IsPostalCode('ES')
    codigoPostal: number;
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())
    @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
    imagen: string;
    @IsOptional()
    @IsBoolean()
    isDeleted: boolean;
}
