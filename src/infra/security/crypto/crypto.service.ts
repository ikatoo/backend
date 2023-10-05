import { Injectable } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
export class CryptoService {
  async hasher(saltRounds: number, password: string) {
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    return `${hashedPassword}`;
  }

  async compareHash(password: string, hash: string) {
    return await compare(password, hash);
  }
}
