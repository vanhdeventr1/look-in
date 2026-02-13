import { RouterModule } from "@nestjs/core";
import { AttendanceImageModule } from "src/features/attendance-image/attendance-image.module";
import { AttendanceModule } from "src/features/attendance/attendance.module";
import { AuthModule } from "src/features/auth/auth.module";
import { DatasetImageModule } from "src/features/dataset-image/dataset-image.module";
import { DatasetModule } from "src/features/dataset/dataset.module";
import { NotificationModule } from "src/features/notification/public/notification.module";
import { PermitImageModule } from "src/features/permit-image/permit-image.module";
import { PermitModule } from "src/features/permit/permit.module";
import { UserDeviceModule } from "src/features/user-device/user-device.module";
import { UserModule } from "src/features/user/user.module";

export default RouterModule.register([
  {
    path: "/api/v1",
    children: [
      {
        path: "auth",
        module: AuthModule,
      },
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "notifications",
        module: NotificationModule,
      },
      {
        path: "user-devices",
        module: UserDeviceModule,
      },
      {
        path: "datasets",
        module: DatasetModule,
        children: [
          {
            path: ":datasetId/images",
            module: DatasetImageModule,
          },
        ],
      },
      {
        path: "attendances",
        module: AttendanceModule,
        children: [
          {
            path: ":attendanceId/images",
            module: AttendanceImageModule,
          },
        ],
      },
      {
        path: "permits",
        module: PermitModule,
        children: [
          {
            path: ":permitId/images",
            module: PermitImageModule,
          },
        ],
      },
    ],
  },
]);
