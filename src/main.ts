import * as morgan from 'morgan';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CORS_OPTIONS } from './common/constants';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { LogsService } from './common/logs/logs.service';
import { UserService } from './users/services/users.service';
import { LoggingInterceptor } from './common/logs/logs.interceptor';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(morgan('dev'));
    app.setGlobalPrefix('api');
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.enableCors(CORS_OPTIONS);
    app.useGlobalPipes(
        new ValidationPipe({
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    // useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const reflector = app.get('Reflector');
    const logsService = app.get(LogsService);
    const userService = app.get(UserService);
  
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(reflector),
        new LoggingInterceptor(logsService, userService)
    ); // Enable transformation

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');     // esta variable no se está usando
    const title: string = configService.get('APP_NAME');
    const url = configService.get('APP_URL');

    // if (configService.get('APP_PROD') === 'false') {
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle(title)
        .setDescription('API Documentation for the application (edit)')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    // }

    await app.listen(3000, '0.0.0.0');          // abre puerto para la app
    console.log(`Application is running on: ${url}`);
}

bootstrap();