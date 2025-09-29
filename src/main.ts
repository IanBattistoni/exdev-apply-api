import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const WEB_ORIGINS = [
    'https://exdev.cl',
    'http://localhost:5000',
    'http://localhost:3000'  
  ];

  app.enableCors({
    origin: (origin, cb) => {
      // permite herramientas como Postman (sin origin)
      if (!origin) return cb(null, true);
      cb(null, WEB_ORIGINS.includes(origin));
    },
    methods: ['GET','POST'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false, 
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
