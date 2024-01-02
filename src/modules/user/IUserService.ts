export type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
  enabled?: boolean;
};

export type UserWithoutPassword = Omit<User, 'password'>;
export type UserWithoutId = Omit<User, 'id'>;

export interface IUserService {
  listAll(): Promise<UserWithoutPassword[]>;
  create(createUserDto: User): Promise<{ id: number }>;
  update(id: number, updateUserDto: Partial<UserWithoutId>): Promise<void>;
  remove(id: number): Promise<void>;
}
