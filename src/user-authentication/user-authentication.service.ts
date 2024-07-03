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
  UpdateUserAuthenticationDto,
} from './dto';
import { User } from './entities/user-authentication.entity';
import { JwtPayload, LoginResponse } from './interfaces';

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
      if (error.status === 401) throw new BadRequestException(error);

      throw new InternalServerErrorException(error);
    }
  }

  async login(loginDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });
      if (!user) throw new UnauthorizedException(`${email} does not exist!`);

      if (!bcryptjs.compareSync(password, user.password)) {
        throw new UnauthorizedException(`${password} does not exist!`);
      }

      const { password: _, ...rest } = user.toJSON();

      return {
        user: rest,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch ({ response: _, ...error }) {
      if (error.status === 401) throw new UnauthorizedException(error);

      throw new InternalServerErrorException(error);
    }
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkToken(token: string) {
    const verifyToken: JwtPayload = this.jwtService.verify(token, {
      secret: process.env.JWT_SEED,
    });

    try {
      if (!verifyToken)
        throw new UnauthorizedException(`Token does not exist!`);

      const user = await this.userModel.findOne({ _id: verifyToken.id });

      if (!user)
        throw new UnauthorizedException(
          `The User: ${verifyToken.id} does not exist!`,
        );

      const { password: _, ...rest } = user.toJSON();

      return {
        user: rest,
        token,
      };
    } catch (error) {
      if (error.status === 401) throw new UnauthorizedException(error);

      throw new InternalServerErrorException(error);

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} userAuthentication`;
  }

  update(id: number, updateUserAuthenticationDto: UpdateUserAuthenticationDto) {
    return `This action updates a #${id} userAuthentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAuthentication`;
  }
}
