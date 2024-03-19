import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupDocument } from 'src/group/group.schema';
import { UserDocument } from 'src/user/user.schema';

export enum NotificationType {
  JOIN_REQUEST = 'join_request',
  JOIN_ACCEPTED = 'join_accepted',
  JOIN_REJECTED = 'join_rejected',
  PREDICTION_MADE = 'prediction_made',
  CORRECT_PREDICTION = 'correct_prediction',
  WRONG_PREDICTION = 'wrong_prediction',
  ACCOUNT_DELETED = 'account_deleted',
  Left_Group = 'left_group',
}

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  type: NotificationType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  group: GroupDocument;

  @Prop({ required: true, default: false })
  isRead: boolean;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
