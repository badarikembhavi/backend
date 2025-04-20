import { Routes } from "@nestjs/core";
import { EncryptModule } from "./Encrypt-Decrypt/encrypt.module";
import { UserModule } from "./user-Module/user.module";



const routes: Routes = [
    {path: '/', module: EncryptModule},
    {path: '/', module: UserModule}
]
export default routes;