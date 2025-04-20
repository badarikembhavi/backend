import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "apps/helpers/guards/jwt.guard";
import { HelperService } from "apps/helpers/helpers/helper.service";
import { EncryptProvider } from "./encrypt.provider";



@Controller('guard')
export class EncryptController {
    constructor(
        private helper: HelperService,
        private encryptProvider: EncryptProvider
    ) { }

    @Post('encrypt')
    @UseGuards(JwtGuard)
    async encrypt(@Body('text') text: string, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
        return this.helper.sendResponse(await this.encryptProvider.encrypted(text), res);
    }

    @Post('decrypt')
    async decrypt(@Body('text') text: string, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
        return this.helper.sendResponse(await this.encryptProvider.decrypted(text), res);
    }

}