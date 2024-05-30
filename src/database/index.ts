import { connect, set } from 'mongoose';
import { NODE_ENV, MONGO_URL } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `${MONGO_URL}`,
    options: {},
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(dbConfig.url);
};
