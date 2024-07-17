import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/user-authentication/entities/user-authentication.entity';
import { UserAuthenticationModule } from 'src/user-authentication/user-authentication.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UserAuthenticationModule
  ],
  exports: [UserService],
})
export class UserModule {}
