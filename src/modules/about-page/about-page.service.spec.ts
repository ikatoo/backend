import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  let service: AboutPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutPageService, PgPromiseService],
    }).compile();

    service = module.get<AboutPageService>(AboutPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get about page', () => {
    const aboutPageMock = {
      title: 'Olá. Bem vindo❗',
      description:
        '<p>Me chamo Milton Carlos Katoo, moro em Itapira, interior de São Paulo/Brasil. Pai de uma princesa e filho de excelente cozinheira Italiana e um saldoso Japonês faz tudo, sou um desenvolvedor full-stack que ama programação e desenvolvimento de software afim de melhorar a vida das pessoas.</p><p>Pessoa bem organizada, solucionador de problemas, funcionário independente com alta atenção aos detalhes. Gosto de animes, mangas, games, séries de TV e filmes. Pai orgulhoso de uma princesa, sou nascido em 1979 e sou innteressado em todo o espectro de programação.</p><p>🎉Vamos fazer algo especial.😄</p>',
      image: {
        url: '/public/teste.img',
        alt: 'imagem de teste',
      },
    };
  });
});
