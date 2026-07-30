const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('../utils/logger');

let sequelize;

if (config.db.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.db.storage || './database.sqlite',
    logging: config.env === 'development' ? (msg) => logger.debug(msg) : false,
  });
} else {
  sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: config.env === 'development' ? (msg) => logger.debug(msg) : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
}

module.exports = sequelize;
