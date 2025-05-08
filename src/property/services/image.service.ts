import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ImagenEntity } from '@/property/entities/image.entity';
import { CreateImageDto, UpdateImageDto } from '@/property/dto/index';
import { PropertyService } from '@/property/services/property.service';



@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ImagenEntity)
        private readonly imageRepository: Repository<ImagenEntity>,
        private readonly propertyService: PropertyService,
    ) {}

    public async create(createImageDto: CreateImageDto): Promise<ImagenEntity> {
        const { propertyId, ...imageData } = createImageDto;
        const property = await this.propertyService.findOne(propertyId);
        if (!property) throw new NotFoundException('Property not found');

        const image = this.imageRepository.create({
            ...imageData,
            property,
        });

        return this.imageRepository.save(image);
    }

    public async findAll(): Promise<ImagenEntity[]> {
        return this.imageRepository.find({ relations: ['property'] });
    }

    public async findOne(id: string): Promise<ImagenEntity> {
        const image = await this.imageRepository.findOne({
            where: { id },
            relations: ['property'],
        });
        if (!image) throw new NotFoundException('Image not found');
        return image;
    }

    public async update(id: string, updateImageDto: UpdateImageDto): Promise<ImagenEntity> {
        const image = await this.findOne(id);
        Object.assign(image, updateImageDto);
        return this.imageRepository.save(image);
    }

    public async remove(id: string): Promise<void> {
        const image = await this.findOne(id);
        await this.imageRepository.remove(image);
    }
}
