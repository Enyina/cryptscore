import { Module } from '@nestjs/common';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { PredictionSchema } from './prediction.schema';
import { MatchSchema } from 'src/match/match.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Prediction', schema: PredictionSchema },
      { name: 'Match', schema: MatchSchema },
    ]),
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
