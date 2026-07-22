import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const Config = app.get(ConfigService);

    console.log('process.env.MONGO_URI =', Config.get<string>('MONGO_URI'));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    app.enableShutdownHooks();
    await app.listen( Config.get<string>('PORT') ?? 3000);
}
bootstrap();
