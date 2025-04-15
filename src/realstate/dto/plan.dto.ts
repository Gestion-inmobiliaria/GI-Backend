import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { PlanInterval } from '../entities/plan.entity';
import { CURRENCY } from '@/common/constants';

export class CreatePlanDto {
  @ApiProperty({
    type: String,
    description: 'name',
    example: 'name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'description',
    example: 'description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'unit_amount',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  unit_amount: number;

  @ApiProperty({
    type: String,
    description: 'currency',
    example: 'USD',
  })
  @IsString()
  currency: CURRENCY;

  @ApiProperty({
    type: String,
    description: 'interval',
    example: 'month',
  })
  @IsString()
  interval: PlanInterval;

  @ApiProperty({
    type: String,
    description: 'contentHtml',
    example: '<p>Content HTML</p>',
  })
  @IsString()
  contentHtml: string;

  @ApiProperty({
    type: Number,
    description: 'amount_users',
    example: 100,
  })
  @IsNumber()
  amount_users: number;

  @ApiProperty({
    type: Number,
    description: 'amount_properties',
    example: 100,
  })
  @IsNumber()
  amount_properties: number;

  @ApiProperty({
    type: Number,
    description: 'amount_sectors',
    example: 100,
  })
  @IsNumber()
  amount_sectors: number;


}

export class UpdatePlanDto extends PartialType(CreatePlanDto) { }

export class CreateSubscriptionDto {
  @ApiProperty({
    type: String,
    description: 'planId',
    example: 'planId',
  })
  @IsString()
  planId: string;
}