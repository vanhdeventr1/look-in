export class UpdateUserDto {
  name: string;
  username?: string;
  email?: string;
  phone_no: string;
  role: number;
  role_name: string;
  is_active?: boolean;
}
