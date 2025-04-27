import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CORS_OPTIONS } from './common/constants';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';



async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(morgan('dev'));
    app.setGlobalPrefix('api');
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
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector)); // Enable transformation

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');
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

    await app.listen(3000, '0.0.0.0'); //abre puerto para la app
    console.log(`Application is running on: ${url}`);
}

bootstrap();
