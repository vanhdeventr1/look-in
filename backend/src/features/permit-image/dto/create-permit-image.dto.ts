export class CreatePermitImageDto {
    permit_images: Array<{
    file_path: string;
    url: string;
    permit_id: number;
  }>;
}
