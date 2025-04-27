import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../users/guards/auth.guard';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PermissionGuard } from '../../users/guards/permission.guard';
import { PERMISSION } from '../../users/constants/permission.constant';
import { PermissionAccess } from '../../users/decorators/permissions.decorator';



@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_CREATE)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }
  
    @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_SHOW)
    @Get()
    findAll() {
        return this.categoryService.findAll();
    }
  
    @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_SHOW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }
  
    @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_UPDATE)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }
  
    @PermissionAccess(PERMISSION.CATEGORY, PERMISSION.CATEGORY_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
