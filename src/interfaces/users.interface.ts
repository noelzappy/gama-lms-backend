import { Role } from '@/config/roles';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  id: string;
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  isEmailVerified: boolean;
}
