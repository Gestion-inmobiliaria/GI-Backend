import { PartialType } from '@nestjs/swagger';
import { CreateImpulsarPropertyDto } from './create-impulsar_property.dto';

export class UpdateImpulsarPropertyDto extends PartialType(CreateImpulsarPropertyDto) {}
