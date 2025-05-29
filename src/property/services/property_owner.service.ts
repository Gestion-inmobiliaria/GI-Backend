import { Injectable,  Logger} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseMessage } from 'src/common/interfaces';
import { PropertyService } from './property.service';
import { PropertyOwnerEntity } from '../entities/property_owner.entity';
import { CreatePropertyOwnerDto } from '../dto/create-property_owner.dto';

@Injectable()
export class PropertyOwnerService {

  private readonly logger = new Logger('PropertyOwnerService');

  constructor(
    @InjectRepository(PropertyOwnerEntity) private readonly propertyOwnerRepository: Repository<PropertyOwnerEntity>,
    private readonly propertyService: PropertyService
  ) {}

  public async create(createPropertyOwnerDto: CreatePropertyOwnerDto): Promise<PropertyOwnerEntity> {
    try {
      const { property,owner } = createPropertyOwnerDto;
      const propertyEntity = await this.propertyService.findOne(property);
      if (!propertyEntity) throw new Error('Property not found');

      const propertyOwnerCreated = this.propertyOwnerRepository.create({ property: { id: property }, owner: { id: owner } });
      return await this.propertyOwnerRepository.save(propertyOwnerCreated);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<ResponseMessage> {
    try {
      const propertyOwner = await this.propertyOwnerRepository.findOne({ where: { id } });

      if (!propertyOwner) throw new Error('property-ownner not found');

      const result = await this.propertyOwnerRepository.delete(id);
      if (result.affected === 0) throw new Error('Error deleting property-owner relation');

      return {
        message: 'Property-owner deleted successfully',
        statusCode: 200
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async getPropertysByOwner(ownerId: string): Promise<PropertyOwnerEntity[]> {
    try {
        return await this.propertyOwnerRepository.find({
            where: { owner: { id: ownerId } },
            relations: ['property'],
          });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async clear(): Promise<void> {
    try {
      await this.propertyOwnerRepository.clear();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}