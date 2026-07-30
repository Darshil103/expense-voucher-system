// Standalone script to create/sync database tables without starting the HTTP server.
// Usage: npm run migrate
const { sequelize } = require('../models');
const logger = require('./logger');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('Database synchronized successfully.');
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
