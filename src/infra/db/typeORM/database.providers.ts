import dataSource from './dataSource';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => dataSource.initialize(),
  },
];
