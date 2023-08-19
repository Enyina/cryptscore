import { Injectable } from '@nestjs/common';
import { Group, GroupDocument } from './group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateGroupDto } from './dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    private readonly userService: UserService,
  ) {}

  async createGroup(userId, dto: CreateGroupDto): Promise<Group> {
    try {
      const newGroup = await this.groupModel.create({
        name: dto.name,
        admin: userId,
      });
      await this.userService.updateUserRoles(userId, 'groupAdmin');
      return newGroup;
    } catch (error) {
      console.log(error);
    }
  }
  async getAll() {
    try {
      const newGroup = await this.groupModel.find();
      return newGroup;
    } catch (error) {
      console.log(error);
    }
  }

  async joinGroup(groupId: string, userId: string): Promise<Group> {
    try {
      return this.groupModel.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<Group> {
    try {
      return this.groupModel.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
