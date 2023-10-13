import {
  Body,
  Controller,
  Param,
  Put,
  Get,
  Delete,
  Patch,
  UseGuards,
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
  updateUser(@Param('id') id: string, @Body() dto: updateUserDto) {
    return this.userService.updateUser(id, dto);
  }
  @Patch('/:id')
  updatePassword(@Param('id') id: string, @Body() dto: updateUserPasswordDto) {
    return this.userService.updatePassword(id, dto);
  }

  @Delete('/:id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  @Get('/:userId')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  getAllUserGroups(@Param('id') userId: string) {
    return this.userService.getAllUserGroups(userId);
  }
}
