import { Module } from '@nestjs/common';

import { UserAuthenticationModule } from './user-authentication/user-authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './conversation/conversation.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserAuthenticationModule,
    ConversationModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
