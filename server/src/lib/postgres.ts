import { PG_DBNAME, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from '../config';
import { Sequelize, DataTypes } from 'sequelize';

export const sequelize = new Sequelize(PG_DBNAME, PG_USER, PG_PASSWORD, {
  dialect: 'postgres',
  port: +PG_PORT,
  host: PG_HOST,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
