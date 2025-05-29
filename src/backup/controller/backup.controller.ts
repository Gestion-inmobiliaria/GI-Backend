import { ResponseMessage } from 'src/common/interfaces';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { PermissionGuard } from 'src/users/guards/permission.guard';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionAccess } from 'src/users/decorators/permissions.decorator';
import { Body, Controller,Get,Post,UseGuards } from '@nestjs/common';
import { BackupService } from '../services/backup.service';
import { RestoreBackupDto } from '../dto/restore-backup.dto';


@ApiTags('Backup')
@Controller('backup')
export class BackupController {
    constructor(private readonly backupService: BackupService) {}

    @UseGuards(AuthGuard, PermissionGuard)
    @ApiBearerAuth()
    @PermissionAccess(PERMISSION.LOG)
    @Post()
    public async createManualBackup(): Promise<ResponseMessage> {
    await this.backupService.executeManualBackup();
    return {
      statusCode: 201,
      data: 'Backup ejecutado correctamente.',
    };
  }

  @UseGuards(AuthGuard, PermissionGuard)
    @ApiBearerAuth()
    @PermissionAccess(PERMISSION.LOG)
  @Post('restore')
async restoreBackup(@Body() dto: RestoreBackupDto) {
  await this.backupService.restoreBackup(dto.fileName);
   return {
    statusCode: 201,
    data:`Backup ${dto.fileName} restaurado correctamente.`
  };
}
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBearerAuth()
  @PermissionAccess(PERMISSION.LOG)
  @Get()
  public getAllBackups(): ResponseMessage {
    const backups = this.backupService.getAllBackups();
    return {
      statusCode: 200,
      data: backups,
    };
  }
}