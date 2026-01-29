export class CreateEmployeeDto {
  name: string;
  email: string;
  username: string;
  password: string; 
  phone_no?: string;
  role?: number;
  is_active?: boolean;
}

