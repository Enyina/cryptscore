import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from '../user/user.schema';
import { GroupDocument } from 'src/group/group.schema';
import { MatchDocument } from 'src/match/match.schema';

export type PredictionDocument = Prediction & Document;

@Schema()
export class Prediction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: 'true' })
  user: UserDocument;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  group: GroupDocument;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Match', required: 'true' })
  match: MatchDocument;

  @Prop({ required: true, enum: ['TEAM_A', 'TEAM_B', 'DRAW'] })
  predictedWinner: string;

  @Prop({ required: true, default: 0 }) // Initial score, you can adjust as needed
  teamAScore: number;

  @Prop({ required: true, default: 0 }) // Initial score, you can adjust as needed
  teamBScore: number;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
