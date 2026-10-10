const HttpError = require('../errors/HttpError');

class NotesService {
  constructor({ notesRepository, categoriesRepository, tagsRepository, sequelize, logger }) {
    this.notes = notesRepository;
    this.categories = categoriesRepository;
    this.tags = tagsRepository;
    this.sequelize = sequelize;
    this.logger = logger;
  }

  list(filters) {
    return this.notes.findAll(filters);
  }

  async get(id) {
    const note = await this.notes.findById(id);
    if (!note) throw new HttpError(404, 'Note not found');
    return note;
  }

  async validateReferences(categoryId, tagIds) {
    if (categoryId !== undefined && categoryId !== null && !(await this.categories.findById(categoryId))) {
      throw new HttpError(400, 'categoryId does not refer to an existing category');
    }
    if (tagIds !== undefined) {
      const uniqueIds = [...new Set(tagIds)];
      const found = await Promise.all(uniqueIds.map((id) => this.tags.findById(id)));
      if (found.some((tag) => !tag)) throw new HttpError(400, 'tagIds must refer to existing tags');
      return found;
    }
    return undefined;
  }

  async create(data) {
    const tagRows = await this.validateReferences(data.categoryId, data.tagIds);
    const note = await this.sequelize.transaction(async (transaction) => {
      const created = await this.notes.create({
        title: data.title.trim(),
        content: data.content.trim(),
        categoryId: data.categoryId ?? null
      }, transaction);
      if (tagRows) await created.setTags(tagRows, { transaction });
      return this.notes.findById(created.id, transaction);
    });
    this.logger.info({ noteId: note.id }, 'Note created');
    return note;
  }

  async update(id, data) {
    await this.get(id);
    const tagRows = await this.validateReferences(data.categoryId, data.tagIds);
    const changes = { ...data };
    delete changes.tagIds;
    if (changes.title !== undefined) changes.title = changes.title.trim();
    if (changes.content !== undefined) changes.content = changes.content.trim();
    const note = await this.sequelize.transaction(async (transaction) => {
      const updated = await this.notes.update(id, changes, transaction);
      if (tagRows) await updated.setTags(tagRows, { transaction });
      return this.notes.findById(id, transaction);
    });
    this.logger.info({ noteId: id }, 'Note updated');
    return note;
  }

  async delete(id) {
    if (!(await this.notes.delete(id))) throw new HttpError(404, 'Note not found');
    this.logger.info({ noteId: id }, 'Note deleted');
  }
}

module.exports = NotesService;
