class TagsRepository {
  constructor({ models }) {
    this.Tag = models.Tag;
  }

  findAll() {
    return this.Tag.findAll({ order: [['name', 'ASC']] });
  }

  findById(id) {
    return this.Tag.findByPk(id, { include: [{ association: 'notes', attributes: ['id', 'title'] }] });
  }

  create(values) {
    return this.Tag.create(values);
  }

  async update(id, values) {
    const tag = await this.Tag.findByPk(id);
    if (!tag) return null;
    await tag.update(values);
    return tag;
  }

  async delete(id) {
    const tag = await this.Tag.findByPk(id);
    if (!tag) return false;
    await tag.destroy();
    return true;
  }
}

module.exports = TagsRepository;
