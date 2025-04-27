import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../users/guards/auth.guard';
import { ModalityService } from '../services/modality.service';
import { CreateModalityDto } from '../dto/create-modality.dto';
import { UpdateModalityDto } from '../dto/update-modality.dto';
import { PermissionGuard } from '../../users/guards/permission.guard';
import { PERMISSION } from '../../users/constants/permission.constant';
import { PermissionAccess } from '../../users/decorators/permissions.decorator';



@ApiTags('Modalities')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller('modalities')
export class ModalityController {
    constructor(private readonly modalityService: ModalityService) {}

    @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_CREATE)
    @Post()
    create(@Body() createModalityDto: CreateModalityDto) {
        return this.modalityService.create(createModalityDto);
    }

    @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_SHOW)
    @Get()
    findAll() {
        return this.modalityService.findAll();
    }

    @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_SHOW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.modalityService.findOne(id);
    }

    @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_UPDATE)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateModalityDto: UpdateModalityDto) {
        return this.modalityService.update(id, updateModalityDto);
    }

    @PermissionAccess(PERMISSION.MODALITY, PERMISSION.MODALITY_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.modalityService.remove(id);
    }
}
