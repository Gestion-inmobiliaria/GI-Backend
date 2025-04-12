import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config = new ConfigService();

const dbPassword = config.get('DB_PASSWORD');
console.log('DB_PASSWORD:', dbPassword);
console.log('typeof DB_PASSWORD:', typeof dbPassword);
