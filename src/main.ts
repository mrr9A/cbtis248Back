import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  /*   await app.listen(3000); */
  const port = process.env.PORT || 3000; // Usar el puerto dinámico asignado
  await app.listen(port);
  console.log(`App running on port ${port}`);
}
bootstrap();

