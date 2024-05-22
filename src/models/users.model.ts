import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/paginate.plugin';

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

export const UserModel = model<User & Document>('User', UserSchema);
