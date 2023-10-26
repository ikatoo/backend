import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';

@Injectable()
export class AboutPageService {
  constructor(private readonly pgp: PgPromiseService) {}

  async create(createAboutPageDto: CreateAboutPageDto) {
    const fields = Object.keys(createAboutPageDto).toString();
    const values = Object.values(createAboutPageDto).toString();

    await this.pgp.db.none('insert into about_pages($1) values ($2);', [
      fields,
      values,
    ]);
  }

  async getPage() {
    const aboutPage = await this.pgp.db.oneOrNone(
      'select * from about_pages limit 1;',
    );
    const skills = await this.pgp.db.manyOrNone(
      `select title from skills, skills_on_users 
      where 
        skills.id=skills_on_users.skill_id
      and
        skills_on_users.user_id=$1;`,
      [aboutPage.user_id],
    );
    const page = { ...aboutPage, skills };

    return page;
  }

  async findByUser(userId: number) {
    const page = await this.pgp.db.oneOrNone(
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
    await this.pgp.db.none(
      'update about_pages set ($1) = ($2) where user_id = $3;',
      [fields, values, userId],
    );
  }

  async remove(userId: number) {
    await this.pgp.db.none('delete from about_pages where user_id = $1', [
      userId,
    ]);
  }
}
