import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { DatasetImageController } from './dataset-image.controller';
import { DatasetImageService } from './dataset-image.service';
import { DatasetImage } from './entities/dataset-image.entity';

@Module({
  imports: [SequelizeModule.forFeature([DatasetImage])],
  controllers: [DatasetImageController],
  providers: [DatasetImageService],
})
export class DatasetImageModule {}


