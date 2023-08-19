import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { updateUserDto } from './dto';

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
      return this.User.find().exec();
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
