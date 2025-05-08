import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagenEntity } from '@/property/entities/imagen.entity';
import { CreateImageDto, UpdateImageDto } from '@/property/dto/index';
import { PropertyService } from '@/property/services/property.service';
import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';



@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ImagenEntity)
        private readonly imageRepository: Repository<ImagenEntity>,
        private readonly propertyService: PropertyService,
    ) {}

    private readonly logger = new Logger('PropertyService');

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

    public async uploadImage(file: Express.Multer.File, propertyId: string): Promise<ImagenEntity> {
        const property = await this.propertyService.findOne(propertyId);
        if (!property) throw new NotFoundException('Property not found');
    
        const image = this.imageRepository.create({
            url: file.path,
            property,
        });
    
        const queryRunner = this.imageRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            const savedImage = await queryRunner.manager.save(image);
            await queryRunner.commitTransaction();
            return savedImage;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error al guardar imagen: ${err.message}`, err.stack);
            throw new InternalServerErrorException('Error al guardar la imagen en la base de datos');
        } finally {
            await queryRunner.release();
        }
    }

    public async uploadMultipleImages(files: Express.Multer.File[], propertyId: string): Promise<ImagenEntity[]> {
        const property = await this.propertyService.findOne(propertyId);
        if (!property) throw new NotFoundException('Property not found');
      
        // transacción para garantizar que todas las imágenes se guarden o ninguna
        const queryRunner = this.imageRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
      
        try {
            const images = [];
            for (const file of files) {
                const image = this.imageRepository.create({
                  url: file.path,
                  property,
                });
                const savedImage = await queryRunner.manager.save(image);
                images.push(savedImage);
            }

            await queryRunner.commitTransaction();
            return images;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error al guardar las imágenes: ' + error.message);
        } finally {
            await queryRunner.release();
        }
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
