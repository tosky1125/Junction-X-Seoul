export class ApplicationConfig {
  private static port = process.env["PORT"];

  private static dialect = process.env["DATABASE_DIALECT"];

  private static host = process.env["DATABASE_HOST"];

  private static AWSKey = process.env["AWSKey"];

  private static AWSSecretKey = process.env["AWSSecretKey"];

  private static user = process.env["DATABASE_USER"];

  private static pw = process.env["DATABASE_PASSWORD"];

  private static database = process.env["DATABASE_NAME"];

  private static TmapApiKey = process.env["TmapApiKey"];

  static getTmapApiKey() {
    return this.TmapApiKey;
  }

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
