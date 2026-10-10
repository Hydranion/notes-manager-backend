const { Op } = require('sequelize');

class NotesRepository {
  constructor({ models }) {
    this.Note = models.Note;
    this.Category = models.Category;
    this.Tag = models.Tag;
  }

  findAll({ q, categoryId, tagId }) {
    const where = {};
    if (q) where[Op.or] = [
      { title: { [Op.like]: `%${q}%` } },
      { content: { [Op.like]: `%${q}%` } }
    ];
    if (categoryId !== undefined) where.categoryId = categoryId;

    const include = [
      { model: this.Category, as: 'category', required: false, attributes: ['id', 'name'] },
      { model: this.Tag, as: 'tags', required: tagId !== undefined }
    ];
    if (tagId !== undefined) include[1].where = { id: tagId };
    return this.Note.findAll({ where, include, order: [['updatedAt', 'DESC']] });
  }

  findById(id, transaction) {
    return this.Note.findByPk(id, {
      transaction,
      include: [
        { model: this.Category, as: 'category', required: false, attributes: ['id', 'name'] },
        { model: this.Tag, as: 'tags', required: false }
      ]
    });
  }

  create(values, transaction) {
    return this.Note.create(values, { transaction });
  }

  async update(id, values, transaction) {
    const note = await this.Note.findByPk(id, { transaction });
    if (!note) return null;
    await note.update(values, { transaction });
    return note;
  }

  async delete(id) {
    const note = await this.Note.findByPk(id);
    if (!note) return false;
    await note.destroy();
    return true;
  }
}

module.exports = NotesRepository;
