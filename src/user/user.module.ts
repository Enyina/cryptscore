import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: User }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
