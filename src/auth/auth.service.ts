import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { createUserDto, loginDto } from 'src/auth/dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private User: Model<User>,
    private jwt: JwtService,
    private congif: ConfigService,
  ) {}

  async register(dto: createUserDto) {
    const users = await this.User.find();
    if (users.length === 0) {
      const pass = await bcrypt.hash('password', 12);
      await this.User.create({
        name: 'admin',
        number: '08061313069',
        email: 'admin@gmail.com',
        password: pass,
      });
    }
    dto.password = await bcrypt.hash(dto.password, 12);
    const createdUser = await this.User.create(dto);
    if (!createdUser) {
      throw new BadRequestException('Unable to create user.');
    }
    createdUser.password = undefined;
    const token = await this.signToken(createdUser.id);

    return { createdUser, token };
  }

  async login(dto: loginDto) {
    const user = await this.User.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    user.password = undefined;

    const token = await this.signToken(user.id);

    return { user, token };
  }

  async signToken(userId) {
    const secret = this.congif.get('JWT_SECRET');

    return await this.jwt.sign(
      { userId },
      {
        expiresIn: '30d',
        secret: secret,
      },
    );
  }

  // Implement  forgotPassword, and resetPassword methods here
}
