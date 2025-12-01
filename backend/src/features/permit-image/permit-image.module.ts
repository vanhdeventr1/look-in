import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { PermitImage } from './entities/permit-image.entity';
import { PermitImageController } from './permit-image.controller';
import { PermitImageService } from './permit-image.service';

@Module({
  imports: [SequelizeModule.forFeature([PermitImage])],
  controllers: [PermitImageController],
  providers: [PermitImageService],
})
export class PermitImageModule {}


