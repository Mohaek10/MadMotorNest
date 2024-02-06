import {IsBoolean, IsNotEmpty, IsNumber, IsString, Length, Min} from "class-validator";

export class CreatePiezaDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 100, {
        message: 'El nombre debe tener entre 2 y 100 caracteres',
    })
    nombre?: string
    @IsNotEmpty()
    @IsString()
    @Length(2, 100, {
        message: 'El descripcion debe tener entre 2 y 100 caracteres',
    })
    descripcion?: string
    @IsNotEmpty()
    @IsString()
    @Length(2, 100, {
        message: 'La imagen debe ser una url valida',
    })
    imagen?: string
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    precio?: number
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock?: number
    isDeleted?:boolean
}