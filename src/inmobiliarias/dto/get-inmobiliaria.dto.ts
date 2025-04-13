import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ORDER_ENUM } from 'src/common/constants';

export class GetInmobiliariaDto {
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({ example: 'ASC', enum: ORDER_ENUM })
  @IsOptional()
  @IsEnum(ORDER_ENUM)
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: 'nombre' })
  @IsOptional()
  @IsString()
  attr?: string;

  @ApiPropertyOptional({ example: 'Águila' })
  @IsOptional()
  @IsString()
  value?: string;
}
