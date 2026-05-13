import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/entities/user.entity";
import { DatasetImage } from "../dataset-image/entities/dataset-image.entity";
import { DatasetController } from "./dataset.controller";
import { DatasetService } from "./dataset.service";
import { Dataset } from "./entities/dataset.entity";

@Module({
  imports: [SequelizeModule.forFeature([Dataset, DatasetImage, User])],
  controllers: [DatasetController],
  providers: [DatasetService],
})
export class DatasetModule {}
