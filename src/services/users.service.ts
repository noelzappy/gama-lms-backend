import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import httpStatus from 'http-status';
import { UserModel } from '@models/users.model';
import { UserDocument } from '@/interfaces/users.interface';
import { RegisterUserDto, UpdateUserDto } from '@/dtos/users.dto';
import { cleanObject } from '@/utils/misc';

@Service()
export class UserService {
  public async findAllUser(): Promise<UserDocument[]> {
    const users = await UserModel.find();
    return users;
  }

  public async findUserById(userId: string): Promise<UserDocument> {
    const findUser = await UserModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(httpStatus.NOT_FOUND, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: RegisterUserDto): Promise<UserDocument> {
    const findUser = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(httpStatus.CONFLICT, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = await UserModel.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<UserDocument> {
    // if (userData.email) {
    //   const findUser: User = await UserModel.findOne({ email: userData.email });
    //   if (findUser && findUser.id != userId) throw new HttpException(httpStatus.CONFLICT, `This email ${userData.email} already exists`);
    // }

    // if (userData.password) {
    //   const hashedPassword = await hash(userData.password, 10);
    //   userData = { ...userData, password: hashedPassword };
    // }

    const _user = await UserModel.findById(userId);
    if (!_user) throw new HttpException(httpStatus.NOT_FOUND, "User doesn't exist");

    Object.assign(_user, cleanObject(userData));
    await _user.save();
    return _user;
  }

  public async deleteUser(userId: string): Promise<UserDocument> {
    const deleteUserById = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }

  public async findUserByEmail(email: string): Promise<UserDocument> {
    const findUser = await UserModel.findOne({ email: email });
    if (!findUser) throw new HttpException(httpStatus.NOT_FOUND, "User doesn't exist");
    return findUser;
  }
}
