import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { QueryDto } from '@/common/dto/query.dto'
import { ResponseGet } from '@/common/interfaces';
import { handlerError } from '@/common/utils';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('CategoryService');
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
  
      const query = this.categoryRepository.createQueryBuilder('category');
  
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('category.name', order.toUpperCase() as any);
  
      if (attr && value) {
        query.andWhere(`category.${attr} ILIKE :value`, { value: `%${value}%` });
      }
  
      const [data, countData] = await query.getManyAndCount();
  
      return {
        data,
        countData,
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    const updated = Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
