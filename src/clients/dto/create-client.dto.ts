import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength, IsBoolean } from 'class-validator';



export class CreateClientDto {
  @ApiProperty({
    example: 'Juan Pérez',
    type: String,
    description: 'Nombre del cliente',
  })
  @IsNotEmpty() @IsString() @MinLength(3) @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'juan.perez@gmail.com',
    type: String,
    description: 'Correo electrónico del cliente',
  })
  @IsNotEmpty() @IsString() @IsEmail() @MaxLength(100)
  email: string;

  @ApiProperty({
    example: '12345678',
    type: String,
    description: 'Número de teléfono del cliente',
  })
  @IsNotEmpty() @IsString() @MinLength(5) @MaxLength(15)
  phone: string;

  @ApiProperty({
    example: '12345678',
    type: String,
    description: 'Carnet de identidad del cliente',
  })
  @IsNotEmpty() @IsString() @MinLength(7) @MaxLength(20)
  ci: string;

  @ApiProperty({
    example: true,
    type: Boolean,
    description: 'Estado activo del cliente',
    default: true,
  })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}