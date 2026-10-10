class CategoriesRepository {
  constructor({ models }) {
    this.Category = models.Category;
    this.Note = models.Note;
  }

  findAll() {
    return this.Category.findAll({
      include: [{ model: this.Note, as: 'notes', attributes: [] }],
      attributes: { include: [[this.Category.sequelize.fn('COUNT', this.Category.sequelize.col('notes.id')), 'noteCount']] },
      group: ['Category.id'],
      order: [['name', 'ASC']]
    });
  }

  findById(id) {
    return this.Category.findByPk(id, {
      include: [{ model: this.Note, as: 'notes', attributes: ['id', 'title'] }]
    });
  }

  create(values) {
    return this.Category.create(values);
  }

  async update(id, values) {
    const category = await this.Category.findByPk(id);
    if (!category) return null;
    await category.update(values);
    return category;
  }

  async delete(id) {
    const category = await this.Category.findByPk(id);
    if (!category) return false;
    await category.destroy();
    return true;
  }
}

module.exports = CategoriesRepository;
