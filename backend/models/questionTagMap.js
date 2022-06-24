'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class questionTagMap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  questionTagMap.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'question',
          key: 'question_id',
        },
      },
      tagId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'tag',
          key: 'tag',
        },
      },
    },
    {
      sequelize,
      modelName: 'question_tag_map',
      tableName: 'question_tag_map',
      underscored: true,
    },
  );
  return questionTagMap;
};
