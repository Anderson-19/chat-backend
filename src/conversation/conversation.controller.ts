import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AuthGuard } from '../user-authentication/guards/auth.guard';

@Controller('conversation')
export class ConversationController {
  constructor(private conversation: ConversationService) {}

  @UseGuards(AuthGuard)
  @Get('/:senderId/:receiverId')
  findAllMessages(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.conversation.findAllMessage(senderId, receiverId);
  }

  @UseGuards(AuthGuard)
  @Delete('/deleteMessage/:messageId')
  deleteMessage(@Param('messageId') messageId: string) {
    return this.conversation.deleteMessage(messageId);
  }
}
