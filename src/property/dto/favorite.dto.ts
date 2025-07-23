import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyEntity } from '../entities/property.entity';

export class AddFavoriteDto {
    @ApiProperty({
        description: 'ID de la propiedad a agregar a favoritos',
        example: 'uuid-de-propiedad'
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    propertyId: string;
}

export class RemoveFavoriteDto {
    @ApiProperty({
        description: 'ID de la propiedad a remover de favoritos',
        example: 'uuid-de-propiedad'
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    propertyId: string;
}

export class GetClientFavoritesDto {
    @ApiProperty({
        description: 'ID del cliente',
        example: 'uuid-del-cliente'
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    clientId: string;
}

export class CheckFavoriteDto {
    @ApiProperty({
        description: 'ID de la propiedad a verificar',
        example: 'uuid-de-propiedad'
    })
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    propertyId: string;
}

export interface FavoriteWithPropertyDto {
    id: string;
    addedAt: Date;
    property: PropertyEntity;
} 