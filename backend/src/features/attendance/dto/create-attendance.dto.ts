export class CreateAttendanceDto {
  clock_in?: Date;
  clock_out?: Date;
  is_late?: boolean;
  late_duration?: number;
  gps_lat?: string;
  gps_lng?: string;
  note?: string;
  attendance_setting_id?: number;
  permit_id?: number;
}
