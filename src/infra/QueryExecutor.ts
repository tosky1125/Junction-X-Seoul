import knex from 'knex';
import config from './knexFile';

export class QueryExecutor {
  static instance = new QueryExecutor();

  private readonly connection: any;

  static getInstance() {
    return this.instance;
  }

  constructor() {
    this.connection = knex(config);
  }

  getConnection() {
    return this.connection;
  }
}
