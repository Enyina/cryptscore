// src/match/match.controller.ts
import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto, UpdateMatchDto } from './dto';
import { Match } from './match.schema';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async createMatch(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchService.createMatch(createMatchDto);
  }

  @Patch(':id')
  async updateMatch(
    @Param('id') matchId: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    return this.matchService.updateMatch(matchId, updateMatchDto);
  }
}
