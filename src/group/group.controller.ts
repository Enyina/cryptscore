import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query
} from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorator';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto';
import { JwtGuard, RoleGuard } from 'src/auth/guard';

@Controller('group')
@UseGuards(JwtGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/create')
  async createGroup(
    @GetUser() userId: string,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    const group = await this.groupService.createGroup(userId, createGroupDto);
    console.log(group);
    return group;
  }
  @Get()
  // @Roles('ADMIN')
  // @UseGuards(RoleGuard)
  async getAllGroup() {
    const group = await this.groupService.getGroups();
    return group;
  }

  @Get('prediction-board')
  async getTopGroupsByTotalPoints(
    @Query('page') page : string = '1',
    @Query('pageSize') pageSize : string = '10',
  ) {
    const groupsList = await this.groupService.getTopGroupsByTotalPoints(
      parseInt(page), parseInt(pageSize)
    );
    return { success: true, data: groupsList };
  }

  @Get('/:groupId/users')
  async getAllGroupUsers(@Param() dto: { groupId: string }) {
    const group = await this.groupService.getGroupUsers(dto.groupId);

    return {success : true, data : group};
  }
  @Get('/:groupId')
  async getGroup(@Param() dto: { groupId: string }) {
    const group = await this.groupService.getGroup(dto.groupId);

    return group;
  }

  @Post('/:groupId/join')
  async joinGroup(
    @GetUser() userId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.groupService.joinGroup(groupId, userId);
  }

  @Put('/:groupId/leave')
  async leaveGroup(
    @GetUser() userId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.groupService.leaveGroup(groupId, userId);
  }

  @Post('/get-invites')
  async getInvites(@Body() dto: { groupId: string }) {
    return this.groupService.getInvites(dto.groupId);
  }
  @Post('/accept-invite')
  async acceptInvite(@Body() dto: { inviteId: string }) {
    return this.groupService.acceptInvites(dto.inviteId);
  }
  @Post('/reject-invite')
  async rejectInvite(@Body() dto: { inviteId: string }) {
    return this.groupService.rejectInvites(dto.inviteId);
  }

  @Get(':userId/groups')
  // @Roles('ADMIN')
  @UseGuards(RoleGuard)
  getAllUserGroups(@Param() param: { userId: string }) {
    return this.groupService.getAllUserGroups(param.userId);
  }


}
