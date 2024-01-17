/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

import { menuCrud } from '@ebedmano/menu';
import { updateCrud } from '@ebedmano/update';
import { subscriptionsCrud } from '@ebedmano/subscriptions';
import { pinoHttp } from 'pino-http';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(
  pinoHttp({
    transport: {
      target: 'pino-pretty',
    },
    redact: {
      paths: ['req', 'res'],
      remove: true,
    },
  })
);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to feedex!' });
});

app.use('/api/menu', menuCrud);
app.use('/api/update', updateCrud);
app.use('/api/subscriptions', subscriptionsCrud);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
