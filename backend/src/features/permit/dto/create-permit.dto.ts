import { CreatePermitImageDto } from "src/features/permit-image/dto/create-permit-image.dto";

export class CreatePermitDto extends CreatePermitImageDto {
  description: string;
  status?: number;
  type: number;
  date_start: Date;
  date_end: Date;
}