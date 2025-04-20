import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HelperModule } from "apps/helpers/helper.module";
import { User } from "entities/user/user.entity";
import { UsersProfile } from "entities/user/users-profile.entity";
import { UserController } from "./user.controller";
import { UserProvider } from "./user.provider";



@Module({
    imports: [
        TypeOrmModule.forFeature([User, UsersProfile]),
        HelperModule
    ],
    controllers: [UserController],
    providers: [UserProvider]
})
export class UserModule {}