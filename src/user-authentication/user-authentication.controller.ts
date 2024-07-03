import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { UserAuthenticationService } from './user-authentication.service';
import { UpdateUserAuthenticationDto } from './dto/update-user-authentication.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

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

  @Get('getAll')
  findAll() {
    return this.userAuthenticationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAuthenticationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserAuthenticationDto: UpdateUserAuthenticationDto) {
    return this.userAuthenticationService.update(+id, updateUserAuthenticationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAuthenticationService.remove(+id);
  }
}
