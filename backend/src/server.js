const app = require('./app');
const config = require('./config/config');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // In production, prefer running migrations explicitly instead of sync().
    await sequelize.sync();
    logger.info('Database synchronized.');

    app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Unable to start the server:');
    logger.error(error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

start();
