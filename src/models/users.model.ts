import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/paginate.plugin';
import { Role } from '@/config/roles';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.STUDENT,
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: 'Ghana',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

export const UserModel = model<User & Document>('User', UserSchema);
