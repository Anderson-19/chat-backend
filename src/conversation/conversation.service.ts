import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server } from 'socket.io';

@Injectable()
export class ConversationService {

  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<any>
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, server: Server) {
    try {

      const { senderId, receiverId, message } = createMessageDto;

      let conversation = await this.conversationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });
  
      if (!conversation) {
        conversation = await this.conversationModel.create({
          participants: [senderId, receiverId],
        });
      }
  
      const newMessage = await this.messageModel.create({
        senderId,
        receiverId,
        message,
      });
  
      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }

      await Promise.all([conversation.save(), newMessage.save()]);

      server.emit("newMessage", newMessage);
      return newMessage;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllMessage(senderId: string, receiverId: string) {

    try {
      const conversation = await this.conversationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate("messages");
  
      if (!conversation) return [];
      
      const messages = conversation.messages;
      return messages;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteMessage(messageId: string): Promise<boolean>{
    try {

      const message = this.messageModel.findById(messageId);

      if(!message) return false;

      await this.conversationModel.updateOne({}, {$pull: { messages: messageId }});
      await this.messageModel.deleteOne({ _id: messageId });

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  
  }

}
