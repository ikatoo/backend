import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import config from './config';

export type DbProviderValues = {
  transaction: (query: string, values: string[]) => Promise<void>;
  query: (query: string, values?: string[]) => Promise<object[]>;
};

const dbProvider = {
  provide: 'PG_CONNECTION',
  useValue: {
    transaction: async (query: string, values: string[]) => {
      const pool = new Pool(config);
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(query, values);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
      }
      client.release();
    },
    query: async (query: string, values?: string[]) => {
      const pool = new Pool(config);

      pool.on('error', (err, client) => {
        console.error(
          'Unexpected error on idle client:',
          client,
          `\nError:`,
          err,
        );
        process.exit(-1);
      });

      const client = await pool.connect();
      const queryResult = await client.query(query, values);
      const result = queryResult.rows;
      client.release();

      return result;
    },
  },
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
