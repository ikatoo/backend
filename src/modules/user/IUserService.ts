import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUserService {
  listAll(): Promise<Omit<UpdateUserDto, 'password'>[]>;
  create(createUserDto: CreateUserDto): Promise<void>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<void>;
  remove(id: number): Promise<void>;
}
