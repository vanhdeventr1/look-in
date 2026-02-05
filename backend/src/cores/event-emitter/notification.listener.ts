import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Sequelize } from "sequelize-typescript";
import { Notification } from "src/features/notification/entities/notification.entity";
import { User } from "src/features/user/entities/user.entity";

@Injectable()
export class NotificationListener {
  constructor(private sequelize: Sequelize) {}

  @OnEvent("notification")
  async notification(options: Array<string>, data: any) {
    try {
      if (options.includes("system")) {
        await this.system(data);
      }
      return true;
    } catch (error) {
      console.log("Notification Listener Error:", error);
    }
  }

  private async system(data: any) {
    if (data.notified_user_id) {
      const user = await User.findByPk(data.notified_user_id);
      if (user) {
        await Notification.create({
          type: data.type,
          data: JSON.stringify({ id: data.data.id }),
          message: data.message || "",
          notified_user_id: data.notified_user_id,
        });
      }
    } else if (data.role) {
      const managers = await User.findAll({
        where: { role: data.role },
      });

      if (managers.length > 0) {
        const notificationPayloads = managers.map((manager) => ({
          type: data.type,
          data: JSON.stringify({ id: data.data.id }),
          message: data.message || "",
          notified_user_id: manager.id,
        }));

        await Notification.bulkCreate(notificationPayloads);
      }
    }
  }
}
