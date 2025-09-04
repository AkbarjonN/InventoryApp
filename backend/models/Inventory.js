import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Inventory extends Model {}

  Inventory.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "Inventory",
      tableName: "inventories",
    }
  );

  return Inventory;
};
