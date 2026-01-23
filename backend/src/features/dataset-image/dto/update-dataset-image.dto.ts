import { PartialType } from '@nestjs/mapped-types';
import { CreateDatasetImageDto } from './create-dataset-image.dto';

export class UpdateDatasetImageDto extends PartialType(CreateDatasetImageDto) {}
