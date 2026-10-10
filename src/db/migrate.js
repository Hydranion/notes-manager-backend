const path = require('node:path');
const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('./sequelize');
const logger = require('../config/logger');

async function migrate() {
  // fast-glob used by Umzug expects forward slashes in absolute patterns on Windows.
  const migrationPattern = `${path.resolve(__dirname, '../../migrations').replaceAll('\\', '/') }/*.cjs`;
  const migrator = new Umzug({
    migrations: { glob: migrationPattern },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger
  });
  await migrator.up();
  logger.info('Database migrations completed');
}

if (require.main === module) {
  migrate().catch((error) => {
    logger.error({ err: error }, 'Database migration failed');
    process.exitCode = 1;
  }).finally(() => sequelize.close());
}

module.exports = { migrate };
