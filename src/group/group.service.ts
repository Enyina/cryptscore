import { Injectable } from '@nestjs/common';
import { Group, GroupDocument } from './group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto';
import { Invite, InviteDocument } from './invite.schema ';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Invite.name) private invite: Model<InviteDocument>,
  ) {}

  async createGroup(userId, dto: CreateGroupDto): Promise<Group> {
    try {
      const newGroup = await this.groupModel.create({
        name: dto.name,
        admin: userId,
        members: [userId],
        isPublic: dto.isPublic,
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
      const groups = await this.groupModel
        .findById(groupId)
        .populate('members');
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

  async joinGroup(groupId: string, userId: string) {
    try {
      const group = await this.groupModel.findById(groupId);
      if (!group.isPublic) {
        await this.invite.create({
          sender: userId,
          reciever: groupId,
        });
        return 'Invite sent successfully';
      }
      return await this.groupModel.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true },
      );
    } catch (error) {
      console.log(error);
    }
  }
  async getInvites(groupId: string) {
    try {
      const invites = await this.invite.find({
        reciever: groupId,
      });
      if (!invites) {
        return 'no invites found';
      }
      return invites;
    } catch (error) {
      console.log(error);
    }
  }
  async acceptInvites(inviteId: string) {
    try {
      const invite = await this.invite.findById({ id: inviteId });
      await this.invite.deleteOne({ id: inviteId });
      return await this.groupModel.findByIdAndUpdate(
        invite.reciever,
        { $addToSet: { members: invite.sender } },
        { new: true },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async rejectInvites(inviteId: string) {
    try {
      await this.invite.deleteOne({ id: inviteId });
      return 'invite rejected';
    } catch (error) {
      console.log(error);
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<Group> {
    try {
      return await this.groupModel.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true },
      );
    } catch (error) {
      console.log('Error leaving group:', error.message);
      throw new Error('Failed to leave group');
    }
  }

  async getTopGroupsByTotalPoints(): Promise<Group[]> {
    const groupsList = await this.groupModel
      .aggregate([
        {
          $project: {
            name: 1,
            totalPoints: { $sum: '$members.points' },
          },
        },
        { $sort: { totalPoints: -1 } },
        { $limit: 10 },
      ])
      .exec();

    return groupsList;
  }
}
