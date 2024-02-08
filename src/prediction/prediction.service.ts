import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PredictionDocument } from './prediction.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MatchDocument } from 'src/match/match.schema';
import { CreatePrediction } from './dto';

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel('Prediction')
    private readonly PredictionModel: Model<PredictionDocument>,
    @InjectModel('Match') private readonly matchModel: Model<MatchDocument>, // private readonly userService: UserService,
  ) {}

  async createPrediction(dto: CreatePrediction) {
    const match = await this.matchModel.findById({ id: dto.matchId });
    const result = this.isWithin5MinutesFromSetTime(match.matchDate);
    if (result) {
      throw new BadRequestException(
        'Can not predict within 5 minutes to match start',
      );
    }
    if (dto.predictedWinner !== 'DRAW' && dto.winnerScore <= dto.loserScore) {
      throw new BadRequestException(
        'winner score has to be greater than loser score',
      );
    }
    if (dto.predictedWinner === 'DRAW' && dto.winnerScore !== dto.loserScore) {
      throw new BadRequestException('score has to be equal');
    }
    let teamAScore;
    let teamBScore;
    if (dto.predictedWinner === 'TEAM_A') {
      teamAScore = dto.winnerScore;
      teamBScore = dto.loserScore;
    } else {
      teamBScore = dto.winnerScore;
      teamAScore = dto.loserScore;
    }
    const createdPrediction = new this.PredictionModel({
      predictedWinner: dto.predictedWinner,
      teamAScore,
      teamBScore,
      user: dto.userId,
      group: dto.groupId,
      match: dto.matchId,
    });
    return createdPrediction.save();
  }

  async getUserPredictedMatches(userId: string) {
    const predictions = await this.PredictionModel.find({
      user: userId,
    });

    if (!predictions) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return { predictionLength: predictions.length, predictions };
  }

  private isWithin5MinutesFromSetTime(setTime) {
    // Convert setTime to milliseconds
    const setTimeMs = new Date(setTime).getTime();

    // Get the current time in milliseconds
    const currentTimeMs = new Date().getTime();

    // Calculate the difference in milliseconds
    const differenceMs = currentTimeMs - setTimeMs;

    // Convert milliseconds to minutes
    const differenceMinutes = Math.abs(differenceMs / (1000 * 60));

    // Check if the difference is less than or equal to 5 minutes
    return differenceMinutes <= 5;
  }
}
