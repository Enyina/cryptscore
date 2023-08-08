import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({
    type: String,
    enum: ['admin', 'user', 'groupAdmin'],
    default: ['user'], // Set the default role to 'user'
    required: true,
  })
  role: string[]; // Use an array to store multiple roles
}

export const UserSchema = SchemaFactory.createForClass(User);
