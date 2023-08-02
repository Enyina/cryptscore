import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() dto: createUserDto) {
    const user = await this.authService.register(dto);
    return { data: user };
  }
  @Post('login')
  async login(@Body() dto: createUserDto) {
    const user = await this.authService.login(dto);
    return { data: user };
  }
}
