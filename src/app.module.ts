import { Module } from '@nestjs/common';

import { UserAuthenticationModule } from './user-authentication/user-authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserAuthenticationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
