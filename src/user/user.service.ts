import { Injectable } from '@nestjs/common';
import { UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private User: Model<UserDocument>) {}
  async addRoleToUser(userId: string, role: string) {
    try {
      const user = await this.User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

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
