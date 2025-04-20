import { Get } from '@nestjs/common';
import { Controller, UseGuards } from '@nestjs/common';
import { Body, Post, Req, Res, Query } from '@nestjs/common';
import { JwtGuard } from 'apps/helpers/guards/jwt.guard';
import { HelperService } from 'apps/helpers/helpers/helper.service';
import { UserProvider } from './user.provider';



@Controller('user')
export class UserController {
  constructor(
    private helper: HelperService,
    private userProvider: UserProvider
  ) { }

  @Post('register')
  async register(@Body() body: { emailAddress: string, password: string }, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.helper.sendResponse(await this.userProvider.register(body), res)
  }

  @Post('login')
  async login(@Body() body: { emailAddress: string, password: string }, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.helper.sendResponse(await this.userProvider.login(body), res)
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getUser(@Res({ passthrough: true }) res: Response, @Req() req: Request & { user?: any }) {
    return this.helper.sendResponse(await this.userProvider.getUser(req.user), res)
  }

  @Get('')
  @UseGuards(JwtGuard)
  async getUsers(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.helper.sendResponse(await this.userProvider.getUsers(), res)
  }

  @Get('pagination')
  @UseGuards(JwtGuard)
  async getUsersAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.helper.sendResponse(
      await this.userProvider.getUsersPaginated(page, limit),
      res
    );
  }


}