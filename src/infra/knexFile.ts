import { ApplicationConfig } from './ApplicationConfig';

const {
  dialect,
  host,
  user,
  password,
  database,
} = ApplicationConfig.getDbConfigs();

const config = {
  client: dialect,
  connection: {
    host,
    user,
    password,
    database,
    typeCast(field, next) {
      if (field.type == 'TINY' && field.length == 1) {
        const value = field.string();
        return value ? (value == '1') : null;
      }
      return next();
    },
  },
};

export default config;
