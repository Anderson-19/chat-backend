import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ConversationService } from './conversation.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:4200',
      'http://localhost:3000',
    ],
  },
})
export class ConversationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('createMessage')
  createMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    return this.conversationService.createMessage(
      createMessageDto,
      this.server,
    );
  }

  async handleConnection(socket: Socket) {
    const { authorization } = socket.handshake?.headers;

    try {
      if (!authorization) return this.disconnect(socket);

      socket.on('userConnected', async (value) => {
        if(!value) return;

        socket.emit('userConnected', await this.userService.findOne(value.email));
      });
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
