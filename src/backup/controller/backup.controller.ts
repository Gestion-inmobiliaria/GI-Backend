import { ResponseMessage } from 'src/common/interfaces';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { Body, Controller,Post,UseGuards } from '@nestjs/common';
import { BackupService } from '../services/backup.service';
import { RestoreBackupDto } from '../dto/restore-backup.dto';


@ApiTags('Backup')
@Controller('backup')
export class BackupController {
    constructor(private readonly backupService: BackupService) {}

    @UseGuards(AuthGuard, PermissionGuard)
    @ApiBearerAuth()
    @PermissionAccess(PERMISSION.BACKUP_CREATE)
    @Post()
    public async createManualBackup(): Promise<ResponseMessage> {
    await this.backupService.executeManualBackup();
    return {
      statusCode: 200,
      data: 'Backup ejecutado correctamente.',
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
    @ApiBearerAuth()
    @PermissionAccess(PERMISSION.BACKUP_RESTORE)
  @Post('restore')
async restoreBackup(@Body() dto: RestoreBackupDto) {
  return this.backupService.restoreBackup(dto.fileName);
}
}