import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Group, GroupDocument } from 'src/group/group.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  points: string;

  @Prop({ maxlength: 10 })
  accNumber: string;

  @Prop({ required: false })
  accName: string;

  @Prop({
    type: [String],
    enum: ['admin', 'user'],
    default: ['user'], // Set the default role to 'user'
    required: true,
  })
  role: string[]; // Use an array to store multiple roles

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Group' }] })
  groups: GroupDocument[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Prediction' }] })
  predictions: GroupDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
