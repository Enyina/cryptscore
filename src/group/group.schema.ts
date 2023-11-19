import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prediction } from 'src/prediction/prediction.schema';
import { User, UserDocument } from 'src/user/user.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;

  // @Prop({
  //   type: String,
  //   enum: ['public', 'private'],
  //   default: 'public', // Set the default role to 'user'
  //   required: true,
  // })
  // groupType: string;
  @Prop({
    type: String,
    required: true,
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  admin: string; // Reference to the admin user

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  members: UserDocument[]; // References to group members

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Prediction' }] })
  correctPredictions: Prediction[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Prediction' }] })
  wrongPredictions: Prediction[];

  @Prop({
    required: true,
    default: true,
  })
  isPublic: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
