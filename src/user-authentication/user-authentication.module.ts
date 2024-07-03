import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { UserAuthenticationService } from './user-authentication.service';
import { User, UserSchema } from './entities/user-authentication.entity';
import { UserAuthenticationController } from './user-authentication.controller';

@Module({
  controllers: [UserAuthenticationController],
  providers: [UserAuthenticationService],
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' },
    }),
  ]
})

export class UserAuthenticationModule {}
