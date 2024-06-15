import { Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/users.service';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';
import { UpdateUserDto } from '@/dtos/users.dto';

export class UserController {
  public user = Container.get(UserService);

  public updateUser = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userId: string = req.user.id;
    const userData: UpdateUserDto = req.body;

    const updateUserData = await this.user.updateUser(userId, userData);

    res.status(httpStatus.CREATED).json(updateUserData);
  });

  public getMe = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userId = req.user.id;

    const user = await this.user.findUserById(userId);

    res.status(httpStatus.OK).json(user);
  });
}
