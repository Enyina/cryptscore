import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get()
  async getAllUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ) {
    const users = await this.adminService.getAllUsers(page, perPage);
    return { success: true, data: users };
  }

  @Get()
  async getAllGroups(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ) {
    const groups = await this.adminService.getAllGroups(page, perPage);
    return { success: true, data: groups };
  }

  @Delete(':id')
  async removeGroup(@Param('id') groupId: string) {
    const removedGroup = await this.adminService.removeGroup(groupId);

    if (!removedGroup) {
      throw new NotFoundException('Group not found');
    }

    return { success: true, message: 'Group removed successfully' };
  }

  @Delete(':id')
  async removeUser(@Param('id') userId: string) {
    const removedUser = await this.adminService.removeUser(userId);

    if (!removedUser) {
      throw new NotFoundException('User not found');
    }

    return { success: true, message: 'User removed successfully' };
  }
}
