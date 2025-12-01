import { PartialType } from '@nestjs/mapped-types';
import { CreatePermitImageDto } from './create-permit-image.dto';

export class UpdatePermitImageDto extends PartialType(CreatePermitImageDto) {}
