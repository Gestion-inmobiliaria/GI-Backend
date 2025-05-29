import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RestoreBackupDto {
   @ApiProperty({
    example: 'backup_2025-05-22T23-45-00-000Z.sql',
    description: 'Nombre del archivo .sql de backup que se encuentra en la carpeta de Backups',
  })  
  @IsString()
  fileName: string; // ejemplo: backup_2025-05-22T23-45-00-000Z.sql
}