import { Injectable } from '@nestjs/common';
import { Group, GroupDocument } from './group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async createGroup(userId, dto: CreateGroupDto): Promise<Group> {
    try {
      const newGroup = await this.groupModel.create({
        name: dto.name,
        admin: userId,
        members: [userId],
      });
      return newGroup;
    } catch (error) {
      console.log(error);
    }
  }
  async getGroups() {
    try {
      const groups = await this.groupModel.find();
      return groups;
    } catch (error) {
      console.log(error);
    }
  }
  async getGroup(groupId) {
    try {
      const groups = await this.groupModel.findById(groupId);
      return groups;
    } catch (error) {
      console.log(error);
    }
  }
  async getGroupUsers(groupId) {
    try {
      const users = await this.groupModel.findById(groupId);
      return users.members;
    } catch (error) {
      console.log(error);
    }
  }
  async getAllUserGroups(userId) {
    try {
      return await this.groupModel.find({ members: userId });
    } catch (error) {
      console.error('Error getting users:', error.message);
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
