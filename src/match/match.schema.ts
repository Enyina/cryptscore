// match.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PredictionDocument } from 'src/prediction/prediction.schema';

export type MatchDocument = Match & Document;

@Schema()
export class Match extends Document {
  @Prop({ required: true })
  teamA: string;

  @Prop({ required: true })
  teamB: string;

  @Prop({ required: true, default: 'Pending' })
  matchStatus: string;

  @Prop({ required: true })
  matchDate: Date;

  // Reference to predictions made for this match
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Prediction' }] })
  matchPredictions: PredictionDocument[];

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  matchOutcome: {
    winner: string; // 'TEAM_A', 'TEAM_B', or 'DRAW'
    teamAScore: number;
    teamBScore: number;
  };
}

export const MatchSchema = SchemaFactory.createForClass(Match);
