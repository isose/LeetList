'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.questionTagMap, {
        foreignKey: 'questionId',
        sourceKey: 'questionId',
        as: 'tags',
      });
      this.hasMany(models.questionTagMap, {
        foreignKey: 'questionId',
        sourceKey: 'questionId',
        as: 'tagsFilter',
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined, createdAt: undefined, updatedAt: undefined };
    }
  }
  question.init(
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
      questionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      upVotes: DataTypes.INTEGER,
      downVotes: DataTypes.INTEGER,
      numberOfAccepted: DataTypes.INTEGER,
      numberOfSubmissions: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'question',
      tableName: 'question',
    },
  );
  return question;
};
