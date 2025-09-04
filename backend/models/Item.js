import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Item extends Model {}

  Item.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdBy: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "Item",
      tableName: "items",
    }
  );

  return Item;
};
