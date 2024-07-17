import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import {
  LoginUserDto,
  RegisterUserDto,
} from './dto';
import { User } from './entities/user-authentication.entity';
import { JwtPayload, LoginResponse } from './interfaces';
import { ResponseGeneric } from './interfaces/response-generic';

@Injectable()
export class UserAuthenticationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    try {
      const { password, ...userData } = registerDto;

      const userExist = await this.userModel.findOne({ email: userData.email });

      if (userExist)
        throw new UnauthorizedException(`${userData.email} already exists!`);

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return { user };
    } catch ({ response: _, ...error }) {
      
      if (error.status === 401) throw new BadRequestException({
        status: 401,
        error: true,
        message: error,
      });

      throw new InternalServerErrorException({
        status: 500,
        error: true,
        message: error,
      });
    }
  }

  async login(loginDto: LoginUserDto): Promise<ResponseGeneric> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });
      if (!user) throw new UnauthorizedException(`${email} does not exist!`);

      await this.userModel.updateOne({ email }, { isActive: true });

      if (!bcryptjs.compareSync(password, user.password)) {
        throw new UnauthorizedException(`${password} does not exist!`);
      }

      const { password: _, ...rest } = user.toJSON();

      return {
        status: 200,
        error: false,
        message: '',
        data: {
          user: rest,
          token: this.getJwtToken({ id: user.id }),
        }
      }
 
    } catch ({ response: _, ...error }) {

      if (error.status === 401) throw new BadRequestException({
        status: 401,
        error: true,
        message: error,
      });

      throw new InternalServerErrorException({
        status: 500,
        error: true,
        message: error,
      });
    }
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async logOut(email: string){
    try {
      await this.userModel.updateOne({ email }, { isActive: false });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(userId: string) {
    return await this.userModel.findOne({ _id: userId });
  }

  
}
