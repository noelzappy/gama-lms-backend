import { AuthRoute } from './auth.route';
import { CourseRoute } from './course.route';
import { MediaRoute } from './media.route';
import { UserRoute } from './users.route';
import { CourseCategoryRoute } from './courseCategory.route';
import { WebhookRoute } from './webhook.route';

const AppRoutes = [new AuthRoute(), new UserRoute(), new CourseRoute(), new MediaRoute(), new CourseCategoryRoute(), new WebhookRoute()];

export default AppRoutes;
