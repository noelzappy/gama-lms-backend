import { Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import catchAsync from '@/utils/catchAsync';
import { RequestWithUser } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = catchAsync(async (req: Request, res: Response) => {
    const findAllUsersData: User[] = await this.user.findAllUser();

    res.status(200).json({ data: findAllUsersData, message: 'findAll' });
  });

  public getUserById = catchAsync(async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const findOneUserData: User = await this.user.findUserById(userId);

    res.status(200).json({ data: findOneUserData, message: 'findOne' });
  });

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const userData: User = req.body;
    const createUserData: User = await this.user.createUser(userData);

    res.status(201).json({ data: createUserData, message: 'created' });
  });

  public updateUser = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userId: string = req.user.id;
    const userData: User = req.body;

    const updateUserData: User = await this.user.updateUser(userId, userData);

    res.status(httpStatus.CREATED).json(updateUserData);
  });

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    //   const userId: string = req.params.id;
    //   const deleteUserData: User = await this.user.deleteUser(userId);
    //   res.status(200).json({ data: deleteUserData, message: 'deleted' });
  });

  public getMe = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userId = req.user.id;

    const user = await this.user.findUserById(userId);

    res.status(httpStatus.FOUND).json(user);
  });
}
