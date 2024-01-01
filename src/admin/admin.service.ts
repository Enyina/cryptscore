import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from 'src/group/group.schema';
import { User, UserDocument } from 'src/user/user.schema';
// import { Invite } from 'src/group/invite.schema ';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Group') private groupModel: Model<GroupDocument>, // @InjectModel(Invite.name) private invite: Model<InviteDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>, // @InjectModel(Invite.name) private invite: Model<InviteDocument>,
  ) {}
  async getAllGroups(page = 1, perPage = 10): Promise<Group[]> {
    const groups = await this.groupModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!groups) {
      throw new NotFoundException('No groups found');
    }

    return groups;
  }

  async getAllUsers(page = 1, perPage = 10): Promise<User[]> {
    const users = await this.userModel
      .find()
      .sort({ points: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!users) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async removeGroup(groupId: string): Promise<Group | null> {
    const removedGroup = await this.groupModel
      .findByIdAndRemove(groupId)
      .exec();
    return removedGroup;
  }

  async removeUser(userId: string): Promise<User | null> {
    const removedUser = await this.userModel.findByIdAndRemove(userId).exec();
    return removedUser;
  }
}
