import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PredictionDocument } from './prediction.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Match, MatchDocument } from 'src/match/match.schema';
import { CreatePrediction } from './dto';
import {
  NotificationDocument,
  NotificationType,
} from 'src/notification/notification.schema';
import { UpdateMatchDto } from 'src/match/dto';

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel('Prediction')
    private readonly PredictionModel: Model<PredictionDocument>,
    @InjectModel('Match') private readonly matchModel: Model<MatchDocument>,
    @InjectModel('Notification')
    private readonly notification: Model<NotificationDocument>,
    private readonly userService: UserService,
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
      await this.notification.create({
        title: 'Create Prediction',
        content: ` ${dto.userId} made a prediction .`,
        type: NotificationType.PREDICTION_MADE,
        user: dto.userId,
        group: dto.groupId,
      });
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

  async getUserPredictionsByMatchDate(
    userId: string,
    matchDate: Date,
    populateMatch = false,
  ) {
    const startDate = new Date(matchDate);
    const endDate = new Date(matchDate);
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
          path: '$match_unwind',
        },
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          'match_unwind.matchDate': {
            $gte: startDate,
            $lt: endDate,
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
          ...(populateMatch && {
            matchDate: '$match_unwind.matchDate',
            matchOutcome: '$match_unwind.matchOutcome',
            teamA: '$match_unwind.teamA',
            teamB: '$match_unwind.teamB',
          }),
        },
      },
    ]);

    return predictions;
  }

  async scoreUserPredictions(match: MatchDocument) {
    const predictions = await this.PredictionModel.find({
      match: new mongoose.Types.ObjectId(match._id),
    });

    for (const prediction of predictions) {
      if (
        prediction.predictedWinner === match.matchOutcome.winner ||
        (prediction.teamAScore === match.matchOutcome.teamAScore &&
          prediction.teamBScore === match.matchOutcome.teamBScore)
      ) {
      }
    }
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

  async updatePredictions(matchId: string, updateMatchDto: UpdateMatchDto) {
    const predictions = await this.PredictionModel
      .find({ match: new mongoose.Types.ObjectId(matchId) });
    for (const prediction of predictions) {
      let score = 0
      if (prediction.predictedWinner.toLocaleLowerCase()
        === updateMatchDto.matchResult.toLocaleLowerCase()) {
        score += 3
      }
      if ((prediction.teamAScore === updateMatchDto.teamAScore &&
        prediction.teamBScore === updateMatchDto.teamBScore)
      ) {
        score += 5
      }
      score && await this.userService
        .updatePointsOnCorrectPrediction(prediction.user._id, score);
    }
  }
}
