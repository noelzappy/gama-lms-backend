import { model, Schema, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { Role } from '@/config/roles';
import { paginate, PaginateOptions, PaginateResult } from './plugins/paginate.plugin';
import { UserDocument } from '@/interfaces/users.interface';

interface UserModel extends Model<UserDocument> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<PaginateResult<UserDocument>>;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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

export const UserModel = model<UserDocument, UserModel>('User', UserSchema);
