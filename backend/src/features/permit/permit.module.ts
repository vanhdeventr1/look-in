import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Permit } from './entities/permit.entity';
import { PermitController } from './permit.controller';
import { PermitService } from './permit.service';

@Module({
  imports: [SequelizeModule.forFeature([Permit])],
  controllers: [PermitController],
  providers: [PermitService],
})
export class PermitModule {}
