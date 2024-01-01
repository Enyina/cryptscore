import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Group } from 'src/group/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: User }]),
    MongooseModule.forFeature([{ name: 'Group', schema: Group }]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
