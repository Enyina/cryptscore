import {
  Body,
  Controller,
  Param,
  Put,
  Get,
  Delete,
  Patch,
  UseGuards,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { updateUserDto, updateUserPasswordDto } from './dto';
import { JwtGuard, RoleGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() dto: updateUserDto) {
    return await this.userService.updateUser(id, dto);
  }
  @Patch('/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: updateUserPasswordDto,
  ) {
    console.log(id);

    return await this.userService.updatePassword(id, dto);
  }

  @Delete('/:id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Get('/users')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }
  @Get('get-groups/:userId')
  // @Roles('ADMIN')
  // @UseGuards(RoleGuard)
  async getAllUserGroups(@Param() params: { userId: string }) {
    return await this.userService.getAllUserGroups(params.userId);
  }

  @Get(':id/predicted-matches/count')
  async getUserPredictedMatchesCount(@Param('id') userId: string) {
    const predictions = await this.userService.getUserPredictedMatches(userId);
    return { predictions };
  }

  @Post(':id/predicted-matches/correct')
  async updatePointsOnCorrectPrediction(
    @Param('id') userId: string,
  ): Promise<void> {
    await this.userService.updatePointsOnCorrectPrediction(userId);
  }

  @Get(':id/points')
  async getUserPoints(
    @Param('id') userId: string,
  ): Promise<{ points: number }> {
    return this.userService.getUserPoints(userId);
  }

  @Get('/prediction-board')
  async getUsersByPoints(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    const usersList = await this.userService.getUsersByPoints(page, pageSize);
    return { success: true, data: usersList };
  }
}
