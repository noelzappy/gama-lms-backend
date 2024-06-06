import { AuthRoute } from './auth.route';
import { CourseRoute } from './course.route';
import { UserRoute } from './users.route';

const AppRoutes = [new AuthRoute(), new UserRoute(), new CourseRoute()];

export default AppRoutes;
