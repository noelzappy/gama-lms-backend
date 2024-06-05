import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import AppRoutes from './routes';
import { logger } from './utils/logger';

// ValidateEnv();
try {


const app = new App(AppRoutes);

app.listen();


} catch (error) {

  logger.log(error);

}
