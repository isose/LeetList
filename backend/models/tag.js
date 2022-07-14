'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.questionTagMap, {
        foreignKey: 'tagId',
        sourceKey: 'tag',
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined, createdAt: undefined, updatedAt: undefined };
    }
  }
  tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'tag',
      tableName: 'tag',
    },
  );
  return tag;
};
