import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // faz validação de tipagem
      disableErrorMessages: true,
    }),
  );

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
