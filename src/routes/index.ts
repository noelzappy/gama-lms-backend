import { AuthRoute } from './auth.route';
import { CourseRoute } from './course.route';
import { MediaRoute } from './media.route';
import { UserRoute } from './users.route';

const AppRoutes = [new AuthRoute(), new UserRoute(), new CourseRoute(), new MediaRoute()];

export default AppRoutes;
