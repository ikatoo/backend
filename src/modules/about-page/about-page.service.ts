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

  async findByUser(userId: number) {
    const page = await this.pgp.db.oneOrNone(
      'select * from about_pages where user_id = $1',
      [userId],
    );

    if (!page) return {};

    const { image_url: imageUrl, image_alt: imageAlt } = page;

    return {
      id: page.id,
      title: page.title,
      description: page.description,
      image: {
        url: imageUrl,
        alt: imageAlt,
      },
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
