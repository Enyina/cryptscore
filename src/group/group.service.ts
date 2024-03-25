import { Injectable } from '@nestjs/common';
import { Group, GroupDocument } from './group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto';
import { Invite, InviteDocument } from './invite.schema ';
import {
  NotificationDocument,
  NotificationType,
} from 'src/notification/notification.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Invite.name) private invite: Model<InviteDocument>,
    @InjectModel('Notification')
    private notification: Model<NotificationDocument>,
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
  async getGroupUsers(groupId: string) {
    try {
      const groups = await this.groupModel.findById(groupId)
        .select('name members isPublic')
        .populate({
          path: 'members',
          select: 'name points',
        });
      return groups;
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

      await this.notification.create({
        title: 'Join Request',
        content: `${userId} has requested to join ${group.name}.`,
        type: NotificationType.JOIN_REQUEST,
        user: userId,
        group: group._id,
      });
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

      const group = await this.groupModel.findByIdAndUpdate(
        invite.reciever,
        { $addToSet: { members: invite.sender } },
        { new: true },
      );

      await this.notification.create({
        title: 'JOIN ACCEPTED',
        content: `Requested to join ${group.name} accepted.`,
        type: NotificationType.JOIN_ACCEPTED,
        user: invite.sender,
        group: group._id,
      });
      await this.invite.deleteOne({ id: inviteId });
      return group;
    } catch (error) {
      console.log(error);
    }
  }

  async rejectInvites(inviteId: string) {
    try {
      const invite = await this.invite.findById({ id: inviteId });

      const group = await this.groupModel.findById(invite.reciever);
      await this.notification.create({
        title: 'JOIN ACCEPTED',
        content: `Requested to join ${group.name} rejected.`,
        type: NotificationType.JOIN_REJECTED,
        user: invite.sender,
        group: group._id,
      });
      await this.invite.deleteOne({ id: inviteId });
      return 'invite rejected';
    } catch (error) {
      console.log(error);
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<Group> {
    try {
      const group = await this.groupModel.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true },
      );
      await this.notification.create({
        title: 'JOIN ACCEPTED',
        content: `${userId} left the Group.`,
        type: NotificationType.Left_Group,
        user: userId,
        group: group._id,
      });
      return group;
    } catch (error) {
      console.log('Error leaving group:', error.message);
      throw new Error('Failed to leave group');
    }
  }

  async getTopGroupsByTotalPoints(
    page: number,
    pageSize: number,
  ): Promise<Group[]> {
    const groupsList = await this.groupModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          }
        },
        {
          $project: {
            name: 1,
            totalPoints: { $sum: '$members.points' },
            isPublic: 1,
            membersCount: { $size: '$members' }
          },
        },
        { $sort: { totalPoints: -1 } },
        { $limit: pageSize },
        { $skip: (page - 1) * pageSize }
      ])
      .exec();

    return groupsList;
  }
}
