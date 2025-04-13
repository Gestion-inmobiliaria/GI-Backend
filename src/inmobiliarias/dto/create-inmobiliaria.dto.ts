import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInmobiliariaDto {
  @ApiProperty({ example: 'Inmo Águila' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'contacto@inmoaguila.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Calle Libertad #123' })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  eliminado?: boolean;
}
