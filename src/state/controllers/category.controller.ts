import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { AuthGuard } from '../../users/guards/auth.guard';
import { PermissionGuard } from '../../users/guards/permission.guard';
import { PermissionAccess } from '../../users/decorators/permissions.decorator';
import { PERMISSION } from '../../users/constants/permission.constant';
import { ResponseMessage } from '@/common/interfaces';
import { Query } from '@nestjs/common';
import { QueryDto } from '@/common/dto/query.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_CREATE)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.categoryService.create(createCategoryDto),
    };
  }

  @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_SHOW)
  @Get()
  async findAll(@Query() query: QueryDto): Promise<ResponseMessage> {
    const { data, countData } = await this.categoryService.findAll(query);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_SHOW)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseMessage> {
    const category = await this.categoryService.findOne(id);
    return {
      statusCode: 200,
      data: category,
    };
  }

  @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_UPDATE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseMessage> {
    const updated = await this.categoryService.update(id, updateCategoryDto);
    return {
      statusCode: 200,
      data: updated,
    };
  }

  @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseMessage> {
    await this.categoryService.remove(id);
    return {
      statusCode: 200,
      message: 'Categoría eliminada correctamente',
    };
  }
}
