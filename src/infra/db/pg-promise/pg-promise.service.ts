import { Injectable, OnModuleInit } from '@nestjs/common';
import pgPromise, { IDatabase } from 'pg-promise';
import config from './config';

@Injectable()
export class PgPromiseService implements OnModuleInit {
  private connect() {
    const pgp = pgPromise({});

    if (!global.PG_PROMISE_DB) {
      global.PG_PROMISE_DB = pgp(config);
    }

    this.db = global.PG_PROMISE_DB;
  }

  db: IDatabase<any>;

  constructor() {
    this.connect();
  }
  onModuleInit() {
    this.connect();
  }
}
