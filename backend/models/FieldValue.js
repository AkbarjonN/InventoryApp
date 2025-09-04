import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class FieldValue extends Model {}

  FieldValue.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      value: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "FieldValue",
      tableName: "field_values",
    }
  );

  return FieldValue;
};
