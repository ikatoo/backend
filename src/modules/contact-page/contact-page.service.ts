import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateContactPageDto } from './dto/create-contact-page.dto';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';

@Injectable()
export class ContactPageService {
  constructor(private readonly pgp: PgPromiseService) {}

  async create(createContactPageDto: CreateContactPageDto) {
    const fields = Object.keys(createContactPageDto)
      .toString()
      .replace('userId', 'user_id');
    const values = Object.values(createContactPageDto).toString();
    await this.pgp.db.none('insert into contact_pages($1) values ($2);', [
      fields,
      values,
    ]);
  }

  async findByUser(userId: number) {
    const page = await this.pgp.db.oneOrNone(
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

    return page;
  }

  async update(userId: number, updateContactPageDto: UpdateContactPageDto) {
    const fields = Object.keys(updateContactPageDto)
      .toString()
      .replace('userId', 'user_id');
    const values = Object.values(updateContactPageDto).toString();
    await this.pgp.db.none(
      'update contact_pages set ($1) = ($2) where user_id = $3;',
      [fields, values, userId],
    );
  }

  async remove(userId: number) {
    await this.pgp.db.none('delete from contact_pages where user_id=$1', [
      userId,
    ]);
  }
}
