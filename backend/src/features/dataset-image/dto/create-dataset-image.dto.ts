export class CreateDatasetImageDto {
  dataset_images: Array<{
    dataset_id: number;
    file_path?: string;
  }>;
}
