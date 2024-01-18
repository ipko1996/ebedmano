/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

import { menuRoutes } from '@ebedmano/menu';
import { updateRoutes } from '@ebedmano/update';
import { subscriptionsRoutes } from '@ebedmano/subscriptions';
import { pinoHttp } from 'pino-http';
import { connectToDb } from '@ebedmano/kitchenware';

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

app.use('/api/menu', menuRoutes);
app.use('/api/update', updateRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);

const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
  await connectToDb();
  console.log(`🌎 Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
