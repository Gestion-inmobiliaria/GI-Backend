import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRealState {
  @ApiProperty({
    type: 'string',
    description: 'Realstate name',
    example: 'Real State Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Realstate email',
    example: 'matriz@realstate.com'
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Realstate address',
    example: '123 Main St, City, Country',
  })
  @IsString()
  address: string;
}

export class UpdateRealStateDto extends PartialType(CreateRealState) { }
