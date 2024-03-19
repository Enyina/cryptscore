// src/match/match.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto, UpdateMatchDto } from './dto';
import { Match } from './match.schema';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('/create')
  async createMatch(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchService.createMatch(createMatchDto);
  }

  
  @Get()
  async getAllMatches() {
    const matches = await this.matchService.findAll();
    return matches;
  }
  @Get('/match-date')
  async getAllMatchesByDate(@Query('matchDate') matchDate?: Date) {
    const matches = await this.matchService.findAllByDate(matchDate);
    return matches;
  }
  
  @Get(':id')
  async getMatchById(@Param('id') id: string) {
    const match = await this.matchService.findById(id);
    if (!match) {
      return { message: 'Match not found' };
    }
    return match;
  }
  
  @Patch(':id')
  async updateMatch(
    @Param('id') matchId: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    return this.matchService.updateMatch(matchId, updateMatchDto);
  }
}
