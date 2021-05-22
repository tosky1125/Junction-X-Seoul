import express from 'express';
import bodyParser from 'body-parser';
import { ApplicationConfig } from './infra/ApplicationConfig';
import header from './infra/header';
import UserController from './user/UserController';

const app = express();
app.use(header());

app.use(bodyParser.json({ limit: 1024 * 1024 * 50, type: 'application/json' }));

app.use(UserController.getRouter());

app.listen(ApplicationConfig.getPort(), () => {
  console.log(`this server is listening to ${ApplicationConfig.getPort()}`);
});
