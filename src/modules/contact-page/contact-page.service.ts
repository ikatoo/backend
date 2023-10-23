import { Injectable } from '@nestjs/common';
import { CreateContactPageDto } from './dto/create-contact-page.dto';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';
import { PgService } from 'src/infra/db/pg/pg.service';

@Injectable()
export class ContactPageService {
  constructor(private readonly db: PgService) {}

  async create(createContactPageDto: CreateContactPageDto) {
    await this.db.connect();

    const fields = Object.keys(createContactPageDto)
      .toString()
      .replace('userId', 'user_id');
    const values = Object.values(createContactPageDto).toString();
    await this.db.query('insert into contacts_page($1) values ($2);', [
      fields,
      values,
    ]);

    await this.db.end();
  }

  async findByUser(userId: number) {
    await this.db.connect();

    const result = await this.db.query(
      `select
          id,
          title,
          description,
          localization,
          email,
          user_id as userId
        where user_id=$1`,
      [userId],
    );
    const page = result.rows[0];

    await this.db.end();

    return page;
  }

  async update(userId: number, updateContactPageDto: UpdateContactPageDto) {
    await this.db.connect();

    const fields = Object.keys(updateContactPageDto)
      .toString()
      .replace('userId', 'user_id');
    const values = Object.values(updateContactPageDto).toString();
    await this.db.query(
      'update contacts_page set ($1) = ($2) where user_id = $3;',
      [fields, values, userId],
    );

    await this.db.end();
  }

  async remove(userId: number) {
    await this.db.connect();

    await this.db.query('delete from contacts_page where user_id=$1', [userId]);

    await this.db.end();
  }
}
