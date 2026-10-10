const sequelize = require('./db/sequelize');
const { defineModels } = require('./db/models');
const { migrate } = require('./db/migrate');
const { buildContainer } = require('./container');
const { createApp } = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

async function start() {
  const models = defineModels(sequelize);
  await sequelize.authenticate();
  // Running migrations is idempotent: Umzug records applied migrations.
  await migrate();
  const container = buildContainer({ sequelize, models, logger });
  const app = createApp(container);
  const server = app.listen(env.port, () => logger.info({ port: env.port }, 'Notes Manager API started'));

  const shutdown = async (signal) => {
    logger.info({ signal }, 'Shutting down API');
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch(async (error) => {
  logger.error({ err: error }, 'API startup failed');
  await sequelize.close();
  process.exitCode = 1;
});
