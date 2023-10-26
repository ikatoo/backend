import { CreateUserDto } from './create-user.dto';

export type UpdateUserDto = Partial<CreateUserDto> & { hash_password?: string };
