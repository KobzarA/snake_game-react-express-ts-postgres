import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import app from '../app';

import { sequelize } from '../lib/postgres';
import 'dotenv/config';

const PORT = process.env.PORT || 8000;

// const server = http.createServer(app);
const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, '..', '..', 'server-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', '..', 'server-cert.pem')),
  },
  app
);

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`listening on ${bind}`);
});

server.on('close', async () => {
  await sequelize.close();
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  server.listen(PORT);
};

startServer();
