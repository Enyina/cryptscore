import { Module } from '@nestjs/common';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { PredictionSchema } from './prediction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from 'src/notification/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Prediction', schema: PredictionSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
