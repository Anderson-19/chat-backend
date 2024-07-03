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

import { CreateUserAuthenticationDto, LoginUserDto, RegisterUserDto, UpdateUserAuthenticationDto } from './dto';
import { User } from './entities/user-authentication.entity';
import { JwtPayload, LoginResponse } from './interfaces';

@Injectable()
export class UserAuthenticationService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService,) {}

  async create(createUserAuthenticationDto: CreateUserAuthenticationDto) {
    try {
      const { password, ...userData } = createUserAuthenticationDto;

      const userExist = await this.userModel.findOne({ email: userData.email });

      if (userExist) throw new UnauthorizedException(`${ userData.email } already exists!`);
  
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `${createUserAuthenticationDto.email} already exists!`,
        );
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto);

    return {
      user: user,
    };
  }

  async login( loginDto: LoginUserDto ):Promise<LoginResponse> {

    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password:_, ...rest  } = user.toJSON();

    console.log({
      user: rest,
      token: this.getJwtToken({ id: user.id })
    });
      
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  
  }

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll() {
    return `This action returns all userAuthentication`;
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
