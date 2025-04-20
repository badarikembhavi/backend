import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from 'apps/v1/v1.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import V1Routing from './apps/v1/v1.routing'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    V1Module,
    RouterModule.register([
      {
        path: '/v1',
        module: V1Module,
        children: V1Routing
      }
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mariadb',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
