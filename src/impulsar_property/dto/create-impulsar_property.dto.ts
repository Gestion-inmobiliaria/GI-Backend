import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,IsUUID,MinLength,ValidateNested } from 'class-validator';

export class CreateImpulsarPropertyDto {
 
    @ApiProperty({
      type: 'string',
      description:' fecha de inicio del impulso',
      example: '2023-10-01T00:00:00Z',   
    })
    @IsNotEmpty()
    @IsDateString()
    startDate:string;

    @ApiProperty({
      type: 'string',
      description: 'fecha de fin del impulso',
      example: '2023-11-01T00:00:00Z',   
    })
    @IsNotEmpty()
    @IsDateString()
    endDate: string;

    @ApiProperty({
      type: 'string',
      description: 'razon para impulsar el inmueble',
      example: 'es una propiedad destacada con excelente ubicacion y precio competitivo',  
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    razonAImpulsar: string;

    @ApiProperty({example: 'ID',type: String,description: 'Id de la propiedad a impulsar'})
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    property:string;

    @ApiProperty({example: 'ID',type: String,description: 'Id del agente que impulso el inmueble'})
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    user:string;
}