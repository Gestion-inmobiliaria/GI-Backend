import { ORDER_ENUM } from '@/common/constants';
import { AuthGuard } from '@/users/guards/auth.guard';
import { CreateImageDto, UpdateImageDto } from '../dto';
import { ImagesService } from '../services/image.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from '@/config/cloudinary.config';
import { PermissionGuard } from '@/users/guards/permission.guard';
import { PERMISSION } from '@/users/constants/permission.constant';
import { PermissionAccess } from '@/users/decorators/permissions.decorator';
import { ApiTags, ApiParam, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseUUIDPipe, UseGuards, UseInterceptors, 
    UploadedFile, UploadedFiles, BadRequestException} from '@nestjs/common';



@ApiTags('Images')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    // @PermissionAccess(PERMISSION.IMAGE)
    @Post()
    public async create(@Body() createImageDto: CreateImageDto) {
        return this.imagesService.create(createImageDto);
    }

    // @PermissionAccess(PERMISSION.IMAGE)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Archivo de imagen a subir',
                },
                propertyId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID de la propiedad asociada',
                },
            },
        },
    })
    public async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Body('propertyId') propertyId: string,
    ) {
        return this.imagesService.uploadImage(file, propertyId);
    }
    
    // @PermissionAccess(PERMISSION.IMAGE)
    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files', 10, { 
        storage: cloudinaryStorage,
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/image\/(jpeg|png|jpg|gif)/)) {
                return callback(new BadRequestException('Solo se permiten archivos de imagen'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5 megas por archivo
        }
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                propertyId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
    })
    public async uploadMultipleImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('propertyId') propertyId: string,
    ) {
        return this.imagesService.uploadMultipleImages(files, propertyId);
    }

    // @PermissionAccess(PERMISSION.IMAGE, PERMISSION.IMAGE_SHOW)
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'offset', type: 'number', required: false })
    @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
    @ApiQuery({ name: 'attr', type: 'string', required: false })
    @ApiQuery({ name: 'value', type: 'string', required: false })
    @Get()
    public async findAll() {
        return this.imagesService.findAll();
    }

    // @PermissionAccess(PERMISSION.IMAGE, PERMISSION.IMAGE_SHOW)
    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    public async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.imagesService.findOne(id);
    }

    // @PermissionAccess(PERMISSION.IMAGE)
    @ApiParam({ name: 'id', type: 'string' })
    @Patch(':id')
    public async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateImageDto: UpdateImageDto,
    ) {
        return this.imagesService.update(id, updateImageDto);
    }

    // @PermissionAccess(PERMISSION.IMAGE)
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    public async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.imagesService.remove(id);
    }
}
