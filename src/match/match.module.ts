import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { Match, MatchSchema } from './match.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/user.schema';
import { PredictionService } from 'src/prediction/prediction.service';
import { PredictionSchema } from 'src/prediction/prediction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Match', schema: MatchSchema },
      { name: 'User', schema: UserSchema },
      { name : 'Prediction', schema : PredictionSchema}
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService, UserService, PredictionService],
})
export class MatchModule {}
