import path from 'path';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'dotenv/config';
import scoreRouter from './features/score/score.router';

const app = express();

app.use(
  cors({
    origin: true,
  })
);
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline'");
  next();
});
app.use(helmet({ hidePoweredBy: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/scores', scoreRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
