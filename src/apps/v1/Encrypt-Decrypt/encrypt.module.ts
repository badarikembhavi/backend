import { Module } from '@nestjs/common';
import { HelperModule } from 'apps/helpers/helper.module';
import { HelperService } from 'apps/helpers/helpers/helper.service';
import { EncryptController } from './encrypt.controller';
import { EncryptProvider } from './encrypt.provider';



@Module({
    imports:[HelperModule],
    controllers: [EncryptController],
    providers: [EncryptProvider]
})
export class EncryptModule {}