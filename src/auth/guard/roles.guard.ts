import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  jwt = new JwtService();
  constructor(
    private reflector: Reflector,
    @InjectModel('User') private User: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    let user = request.user;
    if (!user) {
      const [_, token] = request.headers.authorization.split(' ');
      const userId = this.jwt.decode(token);
      user = await this.User.findById(userId);
    }
    if (roles.some((role) => user.role?.includes(role))) {
      return true;
    } else {
      return false;
    }
  }
}
