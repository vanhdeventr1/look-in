export class CreateDatasetImageDto {
    dataset_images: Array<{
    file_path: string;
    url: string;
    dataset_id: number;
  }>;
}
