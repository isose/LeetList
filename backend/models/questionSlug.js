'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class questionSlug extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  questionSlug.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'questionSlug',
      tableName: 'question_slug',
      underscored: true,
    },
  );
  return questionSlug;
};
