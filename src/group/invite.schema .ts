import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InviteDocument = Invite & Document;

@Schema()
export class Invite {
  @Prop({
    required: true,
    default: true,
  })
  sender: string; // Use an array to store multiple roles
  @Prop({
    required: true,
    default: true,
  })
  reciever: string; // Use an array to store multiple roles
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
