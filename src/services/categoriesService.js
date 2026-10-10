const HttpError = require('../errors/HttpError');

class CategoriesService {
  constructor({ categoriesRepository, logger }) {
    this.categories = categoriesRepository;
    this.logger = logger;
  }

  list() { return this.categories.findAll(); }

  async get(id) {
    const category = await this.categories.findById(id);
    if (!category) throw new HttpError(404, 'Category not found');
    return category;
  }

  async create(data) {
    const category = await this.categories.create({
      name: data.name.trim(),
      description: data.description?.trim() || null
    });
    this.logger.info({ categoryId: category.id }, 'Category created');
    return category;
  }

  async update(id, data) {
    const changes = { ...data };
    if (changes.name !== undefined) changes.name = changes.name.trim();
    if (changes.description !== undefined) changes.description = changes.description?.trim() || null;
    const category = await this.categories.update(id, changes);
    if (!category) throw new HttpError(404, 'Category not found');
    this.logger.info({ categoryId: id }, 'Category updated');
    return category;
  }

  async delete(id) {
    if (!(await this.categories.delete(id))) throw new HttpError(404, 'Category not found');
    this.logger.info({ categoryId: id }, 'Category deleted');
  }
}

module.exports = CategoriesService;
