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
import mongoose from 'mongoose';

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel('Prediction')
    private readonly PredictionModel: Model<PredictionDocument>,
    @InjectModel('Match') private readonly matchModel: Model<MatchDocument>, // private readonly userService: UserService,
  ) { }

  async createPrediction(dto: CreatePrediction) {
    const match = await this.matchModel.findById(dto.matchId);

    const prediction = await this.PredictionModel.findOne({
      user: dto.userId,
      match: dto.matchId,
    }).exec();

    const result = this.isWithin5MinutesFromSetTime(match.matchDate);
    if (result) {
      throw new BadRequestException(
        'Can not predict within 5 minutes to match start',
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
    if (!prediction) {
      const createdPrediction = new this.PredictionModel({
        predictedWinner: dto.predictedWinner,
        teamAScore,
        teamBScore,
        user: dto.userId,
        match: dto.matchId,
      });
      return createdPrediction.save();
    } else {
      prediction.predictedWinner = dto.predictedWinner;
      prediction.teamAScore = teamAScore;
      prediction.teamBScore = teamBScore;
      return prediction.save();
    }
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

  async getUserPredictionsByMatchDate(userId: string, matchDate: Date) {
    const startDate = new Date(matchDate);
    const endDate = new Date(matchDate)
    endDate.setDate(startDate.getDate() + 1);

    const predictions = await this.PredictionModel.aggregate([
      {
        $lookup: {
          from: 'matches',
          localField: 'match',
          foreignField: '_id',
          as: 'match_unwind',
        },
      },
      {
        $unwind: {
          path: "$match_unwind"
        }
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          'match_unwind.matchDate': {
            $gte: startDate,
            $lt: endDate
          },
        },
      },
      {
        $project: {
          _id: 0,
          match: 1,
          predictedWinner: 1,
          teamAScore: 1,
          teamBScore: 1,
        },
      }
    ]);

    return predictions;
  }

  private isWithin5MinutesFromSetTime(_setTime) {
    // Convert setTime to milliseconds
    const setTime = new Date(_setTime);

    // Get the current time in milliseconds
    const currentTime = new Date();

    // Calculate the difference in milliseconds
    const differenceMs = Number(setTime) - Number(currentTime);

    // Convert milliseconds to minutes
    const differenceMinutes = differenceMs / (1000 * 60);

    // Check if the difference is less than or equal to 5 minutes
    return differenceMinutes <= 5;
  }
}
