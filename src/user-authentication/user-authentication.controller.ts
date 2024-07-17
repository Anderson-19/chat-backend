import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';

import { UserAuthenticationService } from './user-authentication.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces';
import { User } from './entities/user-authentication.entity';

@Controller('api/auth')
export class UserAuthenticationController {

  constructor(private readonly userAuthenticationService: UserAuthenticationService) {}

  @Post('/login')
  login( @Body() loginDto: LoginUserDto  ) {
    return this.userAuthenticationService.login( loginDto );
  }

  @Post('/register')
  register( @Body() registerDto: RegisterUserDto  ) {
    return this.userAuthenticationService.register( registerDto );
  }

  @Get('/logout/:email')
  logOut( @Param('email') email: string ){
    return this.userAuthenticationService.logOut(email);
  }

  @UseGuards( AuthGuard )
  @Get('/checkToken')
  checkToken( @Request() req: Request ): LoginResponse {
    const user = req['user'] as User;

    return {
      user,
      token: this.userAuthenticationService.getJwtToken({ id: user._id })
    }
  }

}
