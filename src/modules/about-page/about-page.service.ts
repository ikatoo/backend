import { Inject, Injectable } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';

@Injectable()
export class AboutPageService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) private readonly db: IDatabase<any>,
  ) {}

  async create(createAboutPageDto: CreateAboutPageDto) {
    const fields = Object.keys(createAboutPageDto).toString();
    const values = Object.values(createAboutPageDto).toString();

    await this.db.none('insert into about_pages($1) values ($2);', [
      fields,
      values,
    ]);
  }

  async findByUser(userId: number) {
    const page = await this.db.oneOrNone(
      'select * from about_pages where user_id = $1',
      [userId],
    );

    return {
      illustrationUrl: page.illustration_url,
      illustrationAlt: page.illustration_alt,
      userId: page.user_id,
    };
  }

  async update(userId: number, updateAboutPageDto: UpdateAboutPageDto) {
    if (!userId) return;

    const fields = Object.keys(updateAboutPageDto).toString();
    const values = Object.values(updateAboutPageDto).toString();
    await this.db.none(
      'update about_pages set ($1) = ($2) where user_id = $3;',
      [fields, values, userId],
    );
  }

  async remove(userId: number) {
    await this.db.none('delete from about_pages where user_id = $1', [userId]);
  }
}
