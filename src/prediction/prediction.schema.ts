import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { Group } from 'src/group/group.schema';

export type PredictionDocument = Prediction & Document;

@Schema()
export class Prediction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  group: Group;

  @Prop({ required: true })
  isCorrect: boolean;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
