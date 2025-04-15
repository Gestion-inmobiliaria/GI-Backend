import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { GENDER } from 'src/common/constants/gender';

export class CreateCustomerDto {
  @ApiProperty({ example: 11223344, type: Number, description: 'Carnet de identidad del cliente' })
  @IsNotEmpty() @IsNumber()
  ci: number;

  @ApiProperty({ example: 'Juan Pérez', type: String, description: 'Nombre del cliente' })
  @IsNotEmpty() @IsString() @MinLength(3) @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'cliente1@gmail.com', type: String, description: 'Correo electrónico' })
  @IsNotEmpty() @IsString() @IsEmail() @MaxLength(100)
  email: string;

  @ApiProperty({ example: '12345678', type: String, description: 'Contraseña' })
  @IsNotEmpty() @IsString() @MinLength(6) @MaxLength(20)
  password: string;

  @ApiProperty({ example: '78945612', type: String, description: 'Teléfono', required: false })
  @IsOptional() @IsString() @MinLength(5) @MaxLength(15)
  phone?: string;

  @ApiProperty({ example: 'masculino', type: String, description: 'Género (masculino, femenino, otro)', required: false })
  @IsOptional() @IsString() @IsEnum(GENDER)
  gender?: GENDER;
}
