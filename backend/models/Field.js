import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Field extends Model {}

  Field.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM("text", "number", "boolean"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Field",
      tableName: "fields",
    }
  );

  return Field;
};
