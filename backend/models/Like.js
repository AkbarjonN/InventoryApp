import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Like extends Model {}

  Like.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    },
    {
      sequelize,
      modelName: "Like",
      tableName: "likes",
    }
  );

  return Like;
};
