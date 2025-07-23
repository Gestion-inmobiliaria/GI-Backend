import { 
    Controller, 
    Post, 
    Delete, 
    Get, 
    Body, 
    Param, 
    UseGuards, 
    Req,
    HttpCode,
    HttpStatus,
    Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoriteService } from '../services/favorite.service';
import { AddFavoriteDto, RemoveFavoriteDto, CheckFavoriteDto, FavoriteWithPropertyDto } from '../dto/favorite.dto';
import { UniversalAuthGuard } from '@/users/guards/universal-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(UniversalAuthGuard)
@ApiBearerAuth()
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Agregar propiedad a favoritos' })
    @ApiResponse({ 
        status: 201, 
        description: 'Propiedad agregada a favoritos exitosamente' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Cliente o propiedad no encontrada' 
    })
    @ApiResponse({ 
        status: 409, 
        description: 'La propiedad ya está en favoritos' 
    })
    async addToFavorites(
        @Body() addFavoriteDto: AddFavoriteDto,
        @Req() req: any
    ) {
        const clientId = req.clientId || req.user?.id;
        return await this.favoriteService.addToFavorites(clientId, addFavoriteDto);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Remover propiedad de favoritos' })
    @ApiResponse({ 
        status: 200, 
        description: 'Propiedad removida de favoritos exitosamente' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'La propiedad no está en favoritos' 
    })
    async removeFromFavorites(
        @Body() removeFavoriteDto: RemoveFavoriteDto,
        @Req() req: any
    ) {
        const clientId = req.clientId || req.user?.id;
        return await this.favoriteService.removeFromFavorites(clientId, removeFavoriteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las propiedades favoritas del cliente' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de propiedades favoritas obtenida exitosamente' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Cliente no encontrado' 
    })
    async getMyFavorites(@Req() req: any): Promise<FavoriteWithPropertyDto[]> {
        const clientId = req.clientId || req.user?.id;
        return await this.favoriteService.getClientFavorites(clientId);
    }

    @Get('by-realstate/:realStateId')
    @ApiOperation({ summary: 'Obtener propiedades favoritas de una inmobiliaria específica' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de propiedades favoritas de la inmobiliaria obtenida exitosamente' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Cliente no encontrado' 
    })
    async getFavoritesByRealState(
        @Param('realStateId') realStateId: string,
        @Req() req: any
    ): Promise<FavoriteWithPropertyDto[]> {
        const clientId = req.clientId || req.user?.id;
        return await this.favoriteService.getFavoritesByRealState(clientId, realStateId);
    }

    @Get('check/:propertyId')
    @ApiOperation({ summary: 'Verificar si una propiedad está en favoritos' })
    @ApiResponse({ 
        status: 200, 
        description: 'Estado de favorito verificado exitosamente' 
    })
    async checkIsFavorite(
        @Param('propertyId') propertyId: string,
        @Req() req: any
    ) {
        const clientId = req.clientId || req.user?.id;
        const checkFavoriteDto: CheckFavoriteDto = { propertyId };
        return await this.favoriteService.checkIsFavorite(clientId, checkFavoriteDto);
    }

    // Endpoint adicional para obtener favoritos de un cliente específico (solo para admin)
    @Get('client/:clientId')
    @ApiOperation({ summary: 'Obtener favoritos de un cliente específico (Admin)' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de favoritos del cliente obtenida exitosamente' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Cliente no encontrado' 
    })
    async getClientFavorites(@Param('clientId') clientId: string): Promise<FavoriteWithPropertyDto[]> {
        return await this.favoriteService.getClientFavorites(clientId);
    }
} 