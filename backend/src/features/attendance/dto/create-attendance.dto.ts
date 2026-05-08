export class CreateAttendanceDto {
  gps_lat: string;
  gps_lng: string;
  note?: string;
  face_confidence?: number;
}
