import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { GENDER } from 'src/common/constants/gender';

export class CreateUserDto {
  @ApiProperty({
    example: 11223344,
    type: Number,
    description: 'Carnet de identidad del usuario',
  })
  @IsNotEmpty() @IsNumber()
  ci: number;

  @ApiProperty({
    example: 'Empleado',
    type: String,
    description: 'Nombre del usuario',
  })
  @IsNotEmpty() @IsString() @MinLength(3) @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'empleado1@gmail.com',
    type: String,
    description: 'Correo electrónico del usuario',
  })
  @IsNotEmpty() @IsString() @IsEmail() @MaxLength(100)
  email: string;

  @ApiProperty({
    example: '12345678',
    type: String,
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty() @IsString() @MinLength(6) @MaxLength(20)
  password: string;

  @ApiProperty({
    example: '12345678',
    type: String,
    description: 'Número de teléfono del usuario',
    nullable: true,
    required: false,
  })
  @IsOptional() @IsString() @MinLength(5) @MaxLength(15)
  phone?: string

  @ApiProperty({
    example: 'Calle 123',
    type: String,
    description: 'Dirección del usuario',
  })
  @IsOptional() @IsString() @MaxLength(100)
  address?: string;

  @ApiProperty({
    example: 'masculino',
    type: String,
    description: 'Género del usuario (masculino, femenino o otro)',
  })
  @IsOptional() @IsString() @IsEnum(GENDER)
  gender?: GENDER;

  @ApiProperty({
    example: 'ID',
    type: String,
    description: 'Id del rol del usuario',
  })
  @IsNotEmpty() @IsString() @IsUUID()
  role: string;


}
