import { Injectable } from '@nestjs/common';
import pgPromise, { IDatabase } from 'pg-promise';
import config from './config';

@Injectable()
export class PgPromiseService {
  async onModuleInit() {
    const pgp = pgPromise({});
    if (!this.db) this.db = pgp(config);
  }

  db: IDatabase<any>;
}
