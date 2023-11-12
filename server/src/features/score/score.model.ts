import { DataTypes } from 'sequelize';

import { sequelize } from '../../lib/postgres';

export const Score = sequelize.define('Score', {
  name: DataTypes.STRING,
  score: DataTypes.INTEGER,
});

(async () => {
  await sequelize.sync({ alter: true });
})();
