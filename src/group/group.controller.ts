import { Body, Controller, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(
    @GetUser() userId: string,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    const group = await this.groupService.createGroup(userId, createGroupDto);

    return group;
  }

  @Post(':id/join')
  async joinGroup(@GetUser() userId: string, @Param('id') groupId: string) {
    return this.groupService.joinGroup(groupId, userId);
  }

  @Post(':id/leave')
  async leaveGroup(@GetUser() userId: string, @Param('id') groupId: string) {
    return this.groupService.leaveGroup(groupId, userId);
  }
}
