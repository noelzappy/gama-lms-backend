import { AuthRoute } from './auth.route';
import { CourseRoute } from './course.route';
import { MediaRoute } from './media.route';
import { UserRoute } from './users.route';
import { CourseCategoryRoute } from './courseCategory.route';

const AppRoutes = [new AuthRoute(), new UserRoute(), new CourseRoute(), new MediaRoute(), new CourseCategoryRoute()];

export default AppRoutes;
