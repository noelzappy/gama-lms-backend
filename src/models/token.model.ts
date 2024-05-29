import { model, Schema, Document, SchemaTypes } from 'mongoose';
import { TokenData, TokenType } from '@/interfaces/auth.interface';
import toJSON from './plugins/toJSON.plugin';

const TokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: Object.values(TokenType),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

TokenSchema.plugin(toJSON);

export const TokenModel = model<TokenData & Document>('Token', TokenSchema);
