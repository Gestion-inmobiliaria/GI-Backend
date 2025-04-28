import { IsNotEmpty, IsNumber, IsString, IsPositive, IsUUID } from 'class-validator';



export class CreateStateDto {
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
    @IsUUID()
    sectorId: string;

    @IsNotEmpty()
    @IsUUID()
    userId: string;
}
