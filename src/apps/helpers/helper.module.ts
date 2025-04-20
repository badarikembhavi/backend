import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JWTStrategy } from './guards/jwt.strategy';
import { HelperService } from './helpers/helper.service';



@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: {expiresIn: '365d'}
            })
        }),
        HttpModule
    ],
    providers: [JwtGuard, JWTStrategy, HelperService],
    exports: [JwtGuard, JWTStrategy, HelperService]
})
export class HelperModule {}