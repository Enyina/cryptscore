import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { createUserDto, loginDto } from 'src/auth/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private User: Model<User>) {}

  async register(dto: createUserDto): Promise<User> {
    dto.password = await bcrypt.hash(dto.password, 12);
    console.log(dto.password);
    const createdUser = await this.User.create(dto);
    createdUser.password = undefined;
    return createdUser;
  }

  async login(dto: loginDto): Promise<User> {
    const user = await this.User.findOne({ name: dto.name });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  // Implement  forgotPassword, and resetPassword methods here
}
