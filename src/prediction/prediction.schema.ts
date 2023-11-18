import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {UserDocument } from '../user/user.schema';
import {GroupDocument } from 'src/group/group.schema';

export type PredictionDocument = Prediction & Document;

@Schema()
export class Prediction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  group: GroupDocument;

  @Prop({ required: true })
  match: string;

  @Prop({ required: true })
  matchTime: string;

  @Prop({ required: true })
  matchStatus: string;

  @Prop({ required: true })
  prediction: string;

  @Prop({ required: true })
  isCorrect: boolean;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
