import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GroupDocument } from 'src/group/group.schema';
import { UserDocument } from 'src/user/user.schema';

// ... (other imports)
export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  type: 'user' | 'group';

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user?: UserDocument;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  group?: GroupDocument;

  @Prop({ required: true, default: false })
  isRead: boolean;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
