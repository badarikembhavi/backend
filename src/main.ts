import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.useGlobalPipes(new ValidationPipe());
  const PORT = configService.get('PORT')
  app.enableCors();
  await app.listen(PORT || 3000);
  // console.log(process.env.PORT)
}
bootstrap();
