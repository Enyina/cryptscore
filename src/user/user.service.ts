import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { updateUserDto, updateUserPasswordDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private User: Model<UserDocument>) {}

  async updateUser(userId: string, updatedUser: updateUserDto) {
    try {
      return this.User.findByIdAndUpdate(userId, updatedUser, { new: true });
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  }
  async updatePassword(userId: string, updatedUser: updateUserPasswordDto) {
    // try {
    const user = await this.User.findById(userId);
    console.log(updatedUser.oldPassword, user.password);
    console.log(user);
    if (
      !user ||
      !(await bcrypt.compare(updatedUser.oldPassword, user.password))
    ) {
      throw new UnauthorizedException('Invalid password');
    }

    user.password = await bcrypt.hash(updatedUser.password, 12);
    return await this.User.findByIdAndUpdate(
      userId,
      { password: user.password },
      { new: true },
    );
    // } catch (error) {
    //   console.error('Error updating user:', error.message);
    // }
  }

  async deleteUser(userId: string) {
    try {
      return this.User.findByIdAndDelete(userId);
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  }

  async getUserById(userId: string) {
    const user = await this.User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.User.find().exec();
    } catch (error) {
      console.error('Error getting users:', error.message);
    }
  }
  async getAllUserGroups(userId) {
    try {
      console.log(userId);
      const user = await this.User.findById(userId).populate('groups').exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      console.log({ user });

      return user.groups;
    } catch (error) {
      console.error('Error getting users:', error.message);
    }
  }

  async updateUserRoles(userId: string, role: string) {
    try {
      const user = await this.getUserById(userId);
      // Push the new role into the roles array
      user.role.push(role);

      // Save the updated user document
      await user.save();

      console.log('Role added to the user:', role);
    } catch (error) {
      console.error('Error adding role to the user:', error.message);
    }
  }
}
