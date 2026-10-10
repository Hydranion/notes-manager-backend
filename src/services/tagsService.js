const HttpError = require('../errors/HttpError');

class TagsService {
  constructor({ tagsRepository, logger }) {
    this.tags = tagsRepository;
    this.logger = logger;
  }

  list() { return this.tags.findAll(); }

  async get(id) {
    const tag = await this.tags.findById(id);
    if (!tag) throw new HttpError(404, 'Tag not found');
    return tag;
  }

  async create(data) {
    const tag = await this.tags.create({ name: data.name.trim() });
    this.logger.info({ tagId: tag.id }, 'Tag created');
    return tag;
  }

  async update(id, data) {
    const tag = await this.tags.update(id, { name: data.name.trim() });
    if (!tag) throw new HttpError(404, 'Tag not found');
    this.logger.info({ tagId: id }, 'Tag updated');
    return tag;
  }

  async delete(id) {
    if (!(await this.tags.delete(id))) throw new HttpError(404, 'Tag not found');
    this.logger.info({ tagId: id }, 'Tag deleted');
  }
}

module.exports = TagsService;
