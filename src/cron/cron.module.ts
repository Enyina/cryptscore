import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { MatchService } from 'src/match/match.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from 'src/match/match.schema';
import { UserService } from 'src/user/user.service';
import { PredictionSchema } from 'src/prediction/prediction.schema';
import { NotificationSchema } from 'src/notification/notification.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Match', schema: MatchSchema },
      { name: 'Prediction', schema: PredictionSchema },
      { name: 'Notification', schema: NotificationSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  providers: [CronService, MatchService, PredictionService, UserService]
})
export class CronModule {}
