import { Injectable } from '@nestjs/common';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateAboutPageDto } from './dto/create-about-page.dto';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';

@Injectable()
export class AboutPageService {
  constructor(private readonly pgp: PgPromiseService) {}

  async create(createAboutPageDto: CreateAboutPageDto) {
    await this.pgp.db.none('insert into about_pages($1:raw) values ($2:raw);', [
      `
        "user_id","title","description"
        ${createAboutPageDto.image.imageUrl ? ',"image_url"' : ''}
        ${createAboutPageDto.image.imageAlt ? ',"image_alt"' : ''}
      `,
      `
        '${createAboutPageDto.userId}',
        '${createAboutPageDto.title}',
        '${createAboutPageDto.description}'
        ${
          createAboutPageDto.image.imageUrl
            ? `,'${createAboutPageDto.image.imageUrl}'`
            : ''
        }
        ${
          createAboutPageDto.image.imageAlt
            ? `,'${createAboutPageDto.image.imageAlt}'`
            : ''
        }
      `,
    ]);
  }

  async findByUser(userId: number) {
    const page = await this.pgp.db.oneOrNone(
      'select * from about_pages where user_id = $1',
      [userId],
    );

    if (!page) return {};

    return {
      id: page.id,
      title: page.title,
      description: page.description,
      image: {
        url: page.image_url,
        alt: page.image_alt,
      },
    };
  }

  async update(userId: number, updateAboutPageDto: UpdateAboutPageDto) {
    if (!userId) return;

    const { title, description, image } = updateAboutPageDto;
    const fieldsValues = [
      title && `title = '${title}'`,
      description && `description = '${description}'`,
      image &&
        `image_url = '${image.imageUrl}', image_alt = '${image.imageAlt}'`,
    ]
      .filter((value) => !!value)
      .toString();

    await this.pgp.db.none(
      'update about_pages set $1:raw where user_id = $2;',
      [`${fieldsValues}`, userId],
    );
  }

  async remove(userId: number) {
    await this.pgp.db.none('delete from about_pages where user_id = $1', [
      userId,
    ]);
  }
}
