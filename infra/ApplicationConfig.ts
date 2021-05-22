export class ApplicationConfig {
  private static port = process.env.PORT || 3000;

  private static dialect = process.env.DATABASE_DIALECT || 'mysql';

  private static host = process.env.DATABASE_HOST || 'database-1.cjapli8daz64.ap-northeast-2.rds.amazonaws.com';

  private static AWSKey = process.env.AWSKey;

  private static AWSSecretKey = process.env.AWSSecretKey;

  private static user = process.env.DATABASE_USER || 'admin';

  private static pw = process.env.DATABASE_PASSWORD || 'admin2021!';

  private static database = process.env.DATABASE_NAME || 'chobo';

  static getAWSKey() {
    return this.AWSKey;
  }

  static getAWSSecretKey() {
    return this.AWSSecretKey;
  }

  static getDbConfigs() {
    return {
      dialect: this.dialect,
      host: this.host,
      user: this.user,
      password: this.pw,
      database: this.database,
    };
  }

  static getPort() {
    return this.port;
  }
}
