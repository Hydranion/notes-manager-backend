const { DataTypes } = require('sequelize');

function defineModels(sequelize) {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(500), allowNull: true }
  }, { tableName: 'categories' });

  const Note = sequelize.define('Note', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(160), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: true }
  }, { tableName: 'notes' });

  const Tag = sequelize.define('Tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(40), allowNull: false, unique: true }
  }, { tableName: 'tags' });

  const NoteTag = sequelize.define('NoteTag', {
    noteId: { type: DataTypes.INTEGER, primaryKey: true },
    tagId: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    tableName: 'note_tags',
    timestamps: false
  });

  Category.hasMany(Note, { as: 'notes', foreignKey: 'categoryId', onDelete: 'SET NULL' });
  Note.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
  Note.belongsToMany(Tag, { through: NoteTag, as: 'tags', foreignKey: 'noteId', otherKey: 'tagId' });
  Tag.belongsToMany(Note, { through: NoteTag, as: 'notes', foreignKey: 'tagId', otherKey: 'noteId' });

  return { Category, Note, Tag, NoteTag };
}

module.exports = { defineModels };
