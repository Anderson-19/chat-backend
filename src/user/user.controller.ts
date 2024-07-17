import {
  Controller,
  Get,
  Param,
  Put,
  Headers,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from './file';
import { AuthGuard } from '../user-authentication/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards( AuthGuard )
  @Get('/findAllUsers')
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @UseGuards( AuthGuard )
  @Get('/:contactInConversation')
  findOne(@Param('contactInConversation') contactInConversation: string) {
    return this.userService.findOne(contactInConversation);
  }

  @UseGuards( AuthGuard )
  @Put('/updateUser/:userId')
  updateUser(
    @Body() { name, lastname, about }: any,
    @Param('userId') userId: string,
  ) {
    return this.userService.updateUser(name, lastname, about, userId);
  }

  @UseGuards( AuthGuard )
  @Put('updateAvatar/:userId')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: `./uploads`,
      filename: editFileName
    }),
    limits: {
      fileSize: 1024 * 1024 * 5, // 5 MB
    },
  }))
  updateAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('userId') userId: string,
    @Headers('server') server: string,
  ) {
    return this.userService.updateAvatar(avatar, userId, server);
  }
}
