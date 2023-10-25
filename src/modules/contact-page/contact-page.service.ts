import { Inject, Injectable } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { CreateContactPageDto } from './dto/create-contact-page.dto';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';

@Injectable()
export class ContactPageService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) private readonly db: IDatabase<any>,
  ) {}

  async create(createContactPageDto: CreateContactPageDto) {
    const fields = Object.keys(createContactPageDto)
      .toString()
      .replace('userId', 'user_id');
    const values = Object.values(createContactPageDto).toString();
    await this.db.none('insert into contacts_page($1) values ($2);', [
      fields,
      values,
    ]);
  }

  async findByUser(userId: number) {
    const page = await this.db.oneOrNone(
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
    await this.db.none(
      'update contacts_page set ($1) = ($2) where user_id = $3;',
      [fields, values, userId],
    );
  }

  async remove(userId: number) {
    await this.db.none('delete from contacts_page where user_id=$1', [userId]);
  }
}
