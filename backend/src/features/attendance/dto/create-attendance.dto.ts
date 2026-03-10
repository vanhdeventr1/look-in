export class CreateAttendanceDto {
  clock_out?: Date;
  gps_lat: string;
  gps_lng: string;
  note?: string;
  permit_id?: number;
}
