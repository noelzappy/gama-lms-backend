import { Role } from '@/config/roles';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: Role;
  firstName: string;
  lastName: string;
}
