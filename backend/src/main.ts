import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    credentials: true, // Permitir el envío de cookies
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
