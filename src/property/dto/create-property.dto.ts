import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoProperty } from '../entities/property.entity'; 
import { CreateUbicacionDto } from './create-ubicacion.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,IsUUID,MinLength,ValidateNested } from 'class-validator';



export class CreatePropertyDto {
    @ApiProperty({ 
        type: 'string',
        description: 'Descripcion del inmueble',
        example:'Casa de 3 habitaciones y 2 baños en el centro de la ciudad',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    descripcion: string;
  
    @ApiProperty({
        type: 'number',
        description: 'Precio del inmueble',
        example: 150000.00,
     })
    @IsNumber()
    @IsNotEmpty()
    precio: number;
   
    @ApiProperty({ 
        enum: EstadoProperty,
        description: 'Estado del inmueble',
        example: EstadoProperty.DISPONIBLE,
    })
    @IsEnum(EstadoProperty)
    @IsOptional()
    estado?: EstadoProperty;
  
    @ApiProperty({
        type: 'number',
        description: 'Area en metros cuadrados del inmueble',
        example: 250,
    })
    @IsNumber()
    @IsNotEmpty()
    area: number;
  
    @ApiProperty({
        type: 'number',
        description: 'Numero de habitaciones del inmueble',
        example: 3,
        required: false,
    })
    @IsNumber()
    @IsNotEmpty()
    NroHabitaciones: number;
  
    @ApiProperty({
        type: 'number',
        description: 'Numero de baños del inmueble',
        example: 2,
        required: false,
    })
    @IsNumber()
    @IsNotEmpty()
    NroBanos: number;
   
    @ApiProperty({
        type: 'number',
        description: 'Numero de estacionamientos del inmueble',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsNotEmpty()
    NroEstacionamientos: number;


    @ApiProperty({

        type: 'number',
        description: 'comision por el inmueble',
        example: 0.15,
     })
    @IsNumber()
    @IsNotEmpty()
    comision: number;

        @ApiProperty({ 
        type: 'string',
        description: 'condicion de compra que tiene un inmueble',
        example:'no se aceptan mascotas, debe pagar en efectivo, precio debatible',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    condicion_Compra: string;

    @ApiProperty({example: 'ID',type: String,description: 'Id del usuario'})
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    user:string;

    @ApiProperty({example: 'ID',type: String,description: 'Id de la categoria'})
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    category:string;

    @ApiProperty({example: 'ID',type: String,description: 'Id de la modalidad'})
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    modality:string;

    @ApiProperty({example: 'ID',type: String,description: 'Id del sector',})
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    sector:string;

    @ApiProperty({ type: CreateUbicacionDto })
    @ValidateNested()
    @Type(()=> CreateUbicacionDto)
    ubicacion: CreateUbicacionDto;
}