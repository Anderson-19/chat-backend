import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './entities/conversation.entity';
import { Message, MessageSchema } from './entities/message.entity';
import { ConversationController } from './conversation.controller';
import { UserAuthenticationModule } from 'src/user-authentication/user-authentication.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [ConversationGateway, ConversationService],
  imports: [
    UserAuthenticationModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: Conversation.name,
        schema: ConversationSchema
      },
      {
        name: Message.name,
        schema: MessageSchema
      }
    ]),
   
  ],
  controllers: [ConversationController]
})
export class ConversationModule {}
