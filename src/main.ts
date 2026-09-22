import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ENV } from '@enums/environment-variable.enum';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const Config = app.get(ConfigService);

    console.log('Config.get<string>(ENV.MONGO_URI) = ', Config.get<string>(ENV.MONGO_URI));
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
    app.use(cookieParser(Config.get<string>(ENV.SESSION_COOKIE_SECRET)));
    await app.listen( Config.get<string>(ENV.PORT) ?? 3000);
}
bootstrap();
