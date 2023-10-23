import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class PgService implements OnModuleInit {
  constructor(pg: Client) {}

  async onModuleInit() {

  }
}
