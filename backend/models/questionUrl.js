'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class questionUrl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  questionUrl.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'questionUrl',
      tableName: 'question_url',
      underscored: true,
    },
  );
  return questionUrl;
};
