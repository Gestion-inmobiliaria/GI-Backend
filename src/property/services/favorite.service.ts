import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from '../entities/favorite.entity';
import { PropertyEntity } from '../entities/property.entity'; 
import { ClientEntity } from '@/users/entities/client.entity';
import { handlerError } from '@/common/utils';
import { AddFavoriteDto, RemoveFavoriteDto, CheckFavoriteDto, FavoriteWithPropertyDto } from '../dto/favorite.dto';

@Injectable()
export class FavoriteService {
    private readonly logger = new Logger(FavoriteService.name);

    constructor(
        @InjectRepository(FavoriteEntity)
        private readonly favoriteRepository: Repository<FavoriteEntity>,
        
        @InjectRepository(PropertyEntity)
        private readonly propertyRepository: Repository<PropertyEntity>,
        
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
    ) {}

    async addToFavorites(clientId: string, addFavoriteDto: AddFavoriteDto): Promise<{ message: string; favorite: FavoriteEntity }> {
        try {
            // Verificar que el cliente existe
            const client = await this.clientRepository.findOne({
                where: { id: clientId }
            });

            if (!client) {
                throw new NotFoundException(`Cliente con ID ${clientId} no encontrado`);
            }

            // Verificar que la propiedad existe
            const property = await this.propertyRepository.findOne({
                where: { id: addFavoriteDto.propertyId }
            });

            if (!property) {
                throw new NotFoundException(`Propiedad con ID ${addFavoriteDto.propertyId} no encontrada`);
            }

            // Verificar si ya está en favoritos
            const existingFavorite = await this.favoriteRepository.findOne({
                where: {
                    client: { id: clientId },
                    property: { id: addFavoriteDto.propertyId }
                }
            });

            if (existingFavorite) {
                throw new ConflictException('Esta propiedad ya está en tus favoritos');
            }

            // Crear el favorito
            const favorite = this.favoriteRepository.create({
                client,
                property
            });

            const savedFavorite = await this.favoriteRepository.save(favorite);

            return {
                message: 'Propiedad agregada a favoritos exitosamente',
                favorite: savedFavorite
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    async removeFromFavorites(clientId: string, removeFavoriteDto: RemoveFavoriteDto): Promise<{ message: string }> {
        try {
            // Buscar el favorito
            const favorite = await this.favoriteRepository.findOne({
                where: {
                    client: { id: clientId },
                    property: { id: removeFavoriteDto.propertyId }
                }
            });

            if (!favorite) {
                throw new NotFoundException('Esta propiedad no está en tus favoritos');
            }

            // Eliminar el favorito
            await this.favoriteRepository.remove(favorite);

            return {
                message: 'Propiedad removida de favoritos exitosamente'
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    async getClientFavorites(clientId: string): Promise<FavoriteWithPropertyDto[]> {
        try {
            // Verificar que el cliente existe
            const client = await this.clientRepository.findOne({
                where: { id: clientId }
            });

            if (!client) {
                throw new NotFoundException(`Cliente con ID ${clientId} no encontrado`);
            }

            // Obtener favoritos con información de la propiedad
            const favorites = await this.favoriteRepository.find({
                where: { client: { id: clientId } },
                relations: [
                    'property', 
                    'property.imagenes', 
                    'property.ubicacion',
                    'property.category',
                    'property.modality',
                    'property.sector'
                ],
                order: { addedAt: 'DESC' }
            });

            return favorites.map(favorite => ({
                id: favorite.id,
                addedAt: favorite.addedAt,
                property: favorite.property
            }));
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    async checkIsFavorite(clientId: string, checkFavoriteDto: CheckFavoriteDto): Promise<{ isFavorite: boolean }> {
        try {
            if (!clientId) {
                return { isFavorite: false };
            }

            const favorite = await this.favoriteRepository.findOne({
                where: {
                    client: { id: clientId },
                    property: { id: checkFavoriteDto.propertyId }
                }
            });

            return { isFavorite: !!favorite };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    async getFavoritesByRealState(clientId: string, realStateId: string): Promise<FavoriteWithPropertyDto[]> {
        try {
            if (!clientId) {
                return [];
            }

            // Verificar que el cliente existe
            const client = await this.clientRepository.findOne({
                where: { id: clientId }
            });

            if (!client) {
                throw new NotFoundException(`Cliente con ID ${clientId} no encontrado`);
            }

            // Obtener favoritos filtrados por inmobiliaria
            const favorites = await this.favoriteRepository.find({
                where: { 
                    client: { id: clientId },
                    property: { user: { id: realStateId } }
                },
                relations: [
                    'property', 
                    'property.imagenes', 
                    'property.ubicacion',
                    'property.category',
                    'property.modality',
                    'property.sector',
                    'property.user'
                ],
                order: { addedAt: 'DESC' }
            });

            return favorites.map(favorite => ({
                id: favorite.id,
                addedAt: favorite.addedAt,
                property: favorite.property
            }));
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}