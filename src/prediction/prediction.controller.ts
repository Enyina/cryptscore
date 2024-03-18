import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PredictionService } from './prediction.service';
import { CreatePrediction } from './dto';

@Controller('prediction')
// @UseGuards(JwtGuard)
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post('/create')
  async predict(@Body() dto: CreatePrediction) {
    return this.predictionService.createPrediction(dto);
  }

  @Get(':id/predicted-matches/count')
  async getUserPredictedMatchesCount(@Param('id') userId: string) {
    const predictions = await this.predictionService.getUserPredictedMatches(
      userId,
    );
    return { predictions };
  }

  @Get(':id/by-date')
  async getUserPredictedMatches(@Param('id') userId: string,
      @Query('matchDate') matchDate?: Date,
      @Query('populateMatch') populateMatch?: boolean) {
    const predictions = await this.predictionService.getUserPredictionsByMatchDate(
      userId, matchDate, populateMatch
    );
    return { predictions };
  }

  // @Get('/:userId/user-predictions/:predictionId')
  // async getUserPredictedMatchesCount(
  //   @Param('userId') userId: string,
  //   @Param('predictionId') predictionId: string,
  // ) {
  //   const predictions = await this.predictionService.getUserPredictions(
  //     userId,
  //     predictionId,
  //   );
  //   return { predictions };
  // }
}
