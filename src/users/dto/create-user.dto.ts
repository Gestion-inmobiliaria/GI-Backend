import { ApiProperty } from '@nestjs/swagger';
import { GENDER } from 'src/common/constants/gender';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';



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

  @ApiProperty({
    example: 'ID',
    type: String,
    description: 'Id del sector del usuario',
  })
  @IsOptional() @IsString() @IsUUID()
  sector?: string;
}

export class RegisterUserDto {
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
    example: 'masculino',
    type: String,
    description: 'Género del usuario (masculino, femenino o otro)',
  })
  @IsOptional() @IsString() @IsEnum(GENDER)
  gender?: GENDER;

  @ApiProperty({
    example: 'Empleado',
    type: String,
    description: 'Nombre de la inmobiliaria',
  })
  @IsNotEmpty() @IsString() @MinLength(3) @MaxLength(100)
  nameRealState: string;
}