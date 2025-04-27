import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class ExcelStateDto {
    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    precio: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    area: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    nroHabitaciones: number;

    @IsNotEmpty()
    @IsNumber()
    sectorId: number;
} 