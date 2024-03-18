import { Module } from '@nestjs/common';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { PredictionSchema } from './prediction.schema';
import { MatchSchema } from 'src/match/match.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Prediction', schema: PredictionSchema },
      { name: 'Match', schema: MatchSchema },
      { name: 'User', schema: UserSchema}
    ]),
  ],
  controllers: [PredictionController],
  providers: [PredictionService, UserService],
})
export class PredictionModule {}
