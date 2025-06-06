import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';



export const CORS_OPTIONS: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
