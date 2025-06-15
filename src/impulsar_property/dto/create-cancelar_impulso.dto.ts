import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelImpulsarPropertyDto {
  @ApiProperty({
    description: 'Razón para cancelar el impulso',
    example: 'La propiedad fue vendida',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  razonACancelar: string;
}