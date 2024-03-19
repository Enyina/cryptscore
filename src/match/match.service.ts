// src/match/match.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from './match.schema';
import { CreateMatchDto, UpdateMatchDto } from './dto';
import { Prediction } from 'src/prediction/prediction.schema';
import { UserService } from '../user/user.service';
import { PredictionService } from 'src/prediction/prediction.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<MatchDocument>,
    private readonly userService: UserService,
    private readonly predictionService : PredictionService
  ) {}

  async createMatch(createMatchDto: CreateMatchDto): Promise<Match> {
    const createdMatch = await this.matchModel.create(createMatchDto);
    return createdMatch;
  }

  async findById(id: string): Promise<Match | null> {
    return this.matchModel.findById(id).exec();
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }
  async findAllByDate(matchDate: Date): Promise<Match[]> {
    const startDate = new Date(matchDate);
    const endDate = new Date(matchDate)
    endDate.setDate(startDate.getDate() + 1);

    return this.matchModel.find(
      { matchDate: { $gte: startDate, $lt: endDate } }
    ).exec();
  }

  async updateMatch(
    matchId: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const existingMatch = await this.matchModel.findByIdAndUpdate(
      matchId,
      {
        $set: {
          matchOutcome: {
            winner: updateMatchDto.matchResult,
            teamAScore: updateMatchDto.teamAScore,
            teamBScore: updateMatchDto.teamBScore,
          },
        },
      },
      { new: true },
    );

    if (!existingMatch) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    return existingMatch;
  }

  async updateMatchOutcome(
    matchId: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<void> {
    const match = await this.matchModel.findByIdAndUpdate(
      matchId,
      {
        matchOutcome: {
          winner: updateMatchDto.matchResult,
          teamAScore: updateMatchDto.teamAScore,
          teamBScore: updateMatchDto.teamBScore,
        },
      },
      { new: true },
    );

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Check if the match has predictions
    if (!match.matchPredictions || match.matchPredictions.length === 0) {
      return; // No predictions, nothing to update
    }

    // Assuming you have an array of user predictions in the match schema
    for (const prediction of match.matchPredictions as Prediction[]) {
      // Check if the user's prediction is correct
      const isPredictionCorrect =
        (updateMatchDto.matchResult === 'TEAM_A' &&
          prediction.predictedWinner === 'TEAM_A' &&
          updateMatchDto.teamAScore > updateMatchDto.teamBScore) ||
        (updateMatchDto.matchResult === 'TEAM_B' &&
          prediction.predictedWinner === 'TEAM_B' &&
          updateMatchDto.teamBScore > updateMatchDto.teamAScore) ||
        (updateMatchDto.matchResult === 'Draw' &&
          prediction.predictedWinner === 'Draw' &&
          updateMatchDto.teamAScore === updateMatchDto.teamBScore);

      if (isPredictionCorrect) {
        await this.userService.updatePointsOnCorrectPrediction(
          prediction.user.id,
        );
      }
    }
  }
}
