import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';



export class CreateModalityDto {
    @ApiProperty({
        example: 'Venta',
        description: 'Venta, Alquiler, Anticretico,etc',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
