import { Injectable } from '@nestjs/common';
import pgPromise, { IDatabase } from 'pg-promise';
import config from './config';

@Injectable()
export class PgPromiseService {
  private pgp = pgPromise({});

  constructor() {
    if (!this.db) this.db = this.pgp(config);
  }

  async onModuleInit() {
    if (!this.db) this.db = this.pgp(config);
  }

  db: IDatabase<any>;
}
