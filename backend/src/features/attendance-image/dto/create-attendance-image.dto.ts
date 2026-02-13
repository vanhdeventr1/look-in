export class CreateAttendanceImageDto {
  attendance_images: Array<{
    file_path: string;
    url: string;
    attendance_id: number;
  }>;
}
