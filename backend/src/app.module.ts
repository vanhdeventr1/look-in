import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import routerConfig from "./cores/configs/router.config";
import { sequelizeConfigAsync } from "./cores/configs/sequelize.config";
import { NotificationListener } from "./cores/event-emitter/notification.listener";
import { ResponseModule } from "./cores/modules/response/response.module";
import { AttendanceImageModule } from "./features/attendance-image/attendance-image.module";
import { AttendanceSettingModule } from "./features/attendance-setting/attendance-setting.module";
import { AttendanceModule } from "./features/attendance/attendance.module";
import { AuthModule } from "./features/auth/auth.module";
import { DatasetImageModule } from "./features/dataset-image/dataset-image.module";
import { DatasetModule } from "./features/dataset/dataset.module";
import { NotificationModule } from "./features/notification/public/notification.module";
import { PermitImageModule } from "./features/permit-image/permit-image.module";
import { PermitModule } from "./features/permit/permit.module";
import { UserDeviceModule } from "./features/user-device/user-device.module";
import { UserModule } from "./features/user/user.module";

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      cache: true,
    }),
    SequelizeModule.forRootAsync(sequelizeConfigAsync),
    EventEmitterModule.forRoot(),
    routerConfig,
    AuthModule,
    ResponseModule,
    UserModule,
    NotificationModule,
    // WhatsappWebModule,
    UserDeviceModule,
    ScheduleModule.forRoot(),
    PermitModule,
    PermitImageModule,
    DatasetModule,
    DatasetImageModule,
    AttendanceModule,
    AttendanceImageModule,
    AttendanceSettingModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationListener],
})
export class AppModule {}
