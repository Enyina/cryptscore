import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GroupModule } from './group/group.module';
import { PredictionModule } from './prediction/prediction.module';
// import { DataBaseModule } from './data-base/data-base.module';
import { MatchModule } from './match/match.module';
// import { MatchNoSpecController } from './match--no-spec/match--no-spec.controller';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_CONNECTION_STRING'),
      }),
    }),
    AuthModule,
    UserModule,
    GroupModule,
    PredictionModule,
    MatchModule,
    AdminModule,
    NotificationModule,
    ScheduleModule.forRoot(),
    CronModule
    // DataBaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
