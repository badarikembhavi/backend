import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from 'entities/base.entity';
// import { User } from 'entities/user/user.entity';
// import { UsersProfile } from 'entities/user/users-profile.entity';
import { EncryptModule } from './Encrypt-Decrypt/encrypt.module';
import { UserModule } from './user-Module/user.module';



@Module({
    imports: [
        TypeOrmModule.forFeature([Base]),
        EncryptModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class V1Module {}