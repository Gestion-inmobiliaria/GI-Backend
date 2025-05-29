import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { exec,ExecOptions } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  public async executeManualBackup(): Promise<void> {
    try {
      const backupDir = path.resolve(process.env.BACKUP_DIR || './backups');

      // Crear la carpeta si no existe
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Nombre del archivo .sql con formato legible
      const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
      const outputPath = path.join(backupDir, fileName);

      
      const dbName = process.env.DB_DATABASE;
      const dbUser = process.env.DB_USERNAME;
      const dbHost = process.env.DB_HOST;
      const dbPort = process.env.DB_PORT;
      const dbPassword = process.env.DB_PASSWORD;

      if (!dbName || !dbUser || !dbHost || !dbPort || !dbPassword) {
        throw new InternalServerErrorException('Faltan variables de entorno necesarias para el backup.');
      }

      const env = Object.fromEntries(
        Object.entries({
          ...process.env,
          PGPASSWORD: String(dbPassword),
        }).map(([key, value]) => [key, value !== undefined ? String(value) : undefined])
      );

     const command = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F p -f "${outputPath}"`;


      this.logger.log(`Ejecutando comando de backup: ${command}`);

      await new Promise<void>((resolve, reject) => {
        const options: ExecOptions = { env: env as NodeJS.ProcessEnv };

        exec(command, options, (error, stdout, stderr) => {
          if (error) {
            this.logger.error(`Error durante el backup:\n${stderr}`);
            return reject(new InternalServerErrorException('Error al ejecutar el backup.'));
          }

          this.logger.log(`Backup exitoso: ${stdout}`);
          resolve();
        });
      });
    } catch (error) {
      this.logger.error('Fallo general al ejecutar el backup manual', error);
      throw new InternalServerErrorException('Fallo al ejecutar el backup.');
    }
  }

  public async restoreBackup(fileName: string): Promise<void> {
  try {
    const backupDir = path.resolve(process.env.BACKUP_DIR || './backups');
    const filePath = path.join(backupDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException(`El archivo "${fileName}" no existe.`);
    }

    const dbName = process.env.DB_DATABASE;
    const dbUser = process.env.DB_USERNAME;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbPassword = process.env.DB_PASSWORD;

    if (!dbName || !dbUser || !dbHost || !dbPort || !dbPassword) {
      throw new InternalServerErrorException('Faltan variables de entorno necesarias para la restauración.');
    }

         const env = Object.fromEntries(
        Object.entries({
          ...process.env,
          PGPASSWORD: String(dbPassword),
        }).map(([key, value]) => [key, value !== undefined ? String(value) : undefined])
      );


    const command = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f "${filePath}"`;

    this.logger.log(`Restaurando desde archivo: ${fileName}`);

    await new Promise<void>((resolve, reject) => {
      const options: ExecOptions = { env: env as NodeJS.ProcessEnv };

      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Error al restaurar:\n${stderr}`);
          return reject(new InternalServerErrorException('Error al restaurar el backup.'));
        }

        this.logger.log(`Restauración exitosa: ${stdout}`);
        resolve();
      });
    });
  } catch (error) {
    this.logger.error('Fallo general al restaurar el backup', error);
    throw new InternalServerErrorException('Fallo al restaurar el backup.');
  }
}
public getAllBackups(): { fileName: string }[] {
  try {
    const backupDir = path.resolve(process.env.BACKUP_DIR || './backups');

    if (!fs.existsSync(backupDir)) {
      return [];
    }

    return fs
      .readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .sort(
        (a, b) =>
          fs.statSync(path.join(backupDir, b)).mtime.getTime() -
          fs.statSync(path.join(backupDir, a)).mtime.getTime()
      )
      .map(file => ({ fileName: file })); // <-- Aquí adaptamos el formato
  } catch (error) {
    this.logger.error('Fallo al obtener la lista de backups', error);
    throw new InternalServerErrorException('No se pudo obtener la lista de backups.');
  }
}
}