import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Nombre de la sucursal',
    example: 'Sucursal Centro',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no debe exceder los 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Dirección de la sucursal',
    example: 'Av. Principal #123, Ciudad',
  })
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString({ message: 'La dirección debe ser un texto' })
  @MaxLength(255, { message: 'La dirección no debe exceder los 255 caracteres' })
  address: string;

  @ApiProperty({
    description: 'Teléfono de contacto de la sucursal',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  @MaxLength(20, { message: 'El teléfono no debe exceder los 20 caracteres' })
  phone?: string;

  @ApiProperty({
    description: 'Email de contacto de la sucursal',
    example: 'sucursal@empresa.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @MaxLength(100, { message: 'El email no debe exceder los 100 caracteres' })
  email?: string;

  @ApiProperty({
    description: 'Descripción de la sucursal',
    example: 'Sucursal principal con atención al cliente',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;
} 