import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user-authentication/entities/user-authentication.entity';
import { unlink } from 'fs/promises';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAllUsers() {
    return await this.userModel.find({});
  }

  async findOne(contactInConversation: string) {
    return await this.userModel.findOne({ email: contactInConversation });
  }
  
  async updateUser(
    name: string,
    lastname: string,
    about: string,
    userId: string,
  ) {
    try {
      const user = await this.userModel.findById({ _id: userId });

      if (!user)
        throw new UnauthorizedException(`The User: ${userId} does not exist!`);

      const data = { name, lastname, about };
      await this.userModel.updateOne({ _id: userId }, data);

      return {
        status: HttpStatus.OK,
        error: false,
        message: 'User updated successfull',
      };

    } catch (error) {
      if (error.status === 401)
        throw new UnauthorizedException({ status: HttpStatus.UNAUTHORIZED, error: true, message: error });

      throw new InternalServerErrorException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: true, message: error });
    }
  }

  async updateAvatar(avatar: Express.Multer.File, userId: string, server: string){

    try {
      const user = await this.userModel.findById({ _id: userId });
      const pathFile = `${server}/uploads/${ avatar.filename }`;

      if (!user)
        throw new UnauthorizedException(`The User: ${userId} does not exist!`);

      if(!user.avatar) {
        await this.userModel.updateOne({ _id: userId }, { avatar: pathFile });
        return { status: HttpStatus.OK, error: false, message: pathFile };
      }

      await unlink(user.avatar.split(`${server}/`).at(-1));
      await this.userModel.updateOne({ _id: userId }, { avatar: pathFile });

      return { status: HttpStatus.OK, error: false, message: pathFile };
    } catch (error) {

      if (error.status === 401)
        throw new UnauthorizedException({ status: HttpStatus.UNAUTHORIZED, error: true, message: error });

      throw new InternalServerErrorException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: true, message: error });
    }
  }


}
