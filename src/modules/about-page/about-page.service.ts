import { Injectable } from '@nestjs/common';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';
import { PgService } from 'src/infra/db/pg/pg.service';

@Injectable()
export class AboutPageService {
  constructor(private readonly db: PgService) {}

  async create(createAboutPageDto: CreateAboutPageDto) {
    await this.db.connect();

    const fields = Object.keys(createAboutPageDto).toString();
    const values = Object.values(createAboutPageDto).toString();

    await this.db.query('insert into about_pages($1) values ($2);', [
      fields,
      values,
    ]);

    await this.db.end();
  }

  async findByUser(userId: number) {
    await this.db.connect();
    const result = await this.db.query(
      'select * from about_pages where user_id = $1',
      [userId],
    );
    const page = result.rows[0];
    await this.db.end();

    return {
      illustrationUrl: page.illustration_url,
      illustrationAlt: page.illustration_alt,
      userId: page.user_id,
    };
  }

  async update(userId: number, updateAboutPageDto: UpdateAboutPageDto) {
    if (!userId) return;
    await this.db.connect();

    const fields = Object.keys(updateAboutPageDto).toString();
    const values = Object.values(updateAboutPageDto).toString();
    await this.db.query(
      'update about_pages set ($1) = ($2) where user_id = $3;',
      [fields, values, userId],
    );

    await this.db.end();
  }

  async remove(userId: number) {
    await this.db.connect();

    await this.db.query('delete from about_pages where user_id = $1', [userId]);

    await this.db.end();
  }
}
