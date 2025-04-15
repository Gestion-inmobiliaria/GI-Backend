import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSectorDto {
    @ApiProperty({
        example: 'Sector Central',
        type: String,
        description: 'Nombre del sector',
    })
    @IsNotEmpty() @IsString()
    name: string;

    @ApiProperty({
        example: 'Calle Principal #123',
        type: String,
        description: 'Dirección del sector',
    })
    @IsString()
    adress: string;

    @ApiProperty({
        example: '12345678',
        type: String,
        description: 'Número de teléfono del sector',
        nullable: true,
        required: false,
    })
    @IsString()
    phone: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
        description: 'ID del estado real',
    })
    @IsNotEmpty() @IsString()
    realStateId: string;
}
