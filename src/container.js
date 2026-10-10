const { createContainer, asClass, asValue, InjectionMode } = require('awilix');
const NotesRepository = require('./repositories/notesRepository');
const CategoriesRepository = require('./repositories/categoriesRepository');
const TagsRepository = require('./repositories/tagsRepository');
const NotesService = require('./services/notesService');
const CategoriesService = require('./services/categoriesService');
const TagsService = require('./services/tagsService');

function buildContainer({ sequelize, models, logger }) {
  const container = createContainer({ injectionMode: InjectionMode.PROXY });
  container.register({
    sequelize: asValue(sequelize),
    models: asValue(models),
    logger: asValue(logger),
    notesRepository: asClass(NotesRepository).singleton(),
    categoriesRepository: asClass(CategoriesRepository).singleton(),
    tagsRepository: asClass(TagsRepository).singleton(),
    notesService: asClass(NotesService).singleton(),
    categoriesService: asClass(CategoriesService).singleton(),
    tagsService: asClass(TagsService).singleton()
  });
  return container;
}

module.exports = { buildContainer };
