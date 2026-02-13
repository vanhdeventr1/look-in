export class CreateAttendanceDto {
  clock_in: Date;
  shift_time: Date;
  is_late: boolean;
  late_duration: number;
  gps_lat: string;
  gps_lng: string;
  note: string;
}
