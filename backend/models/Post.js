import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Post extends Model {}

  Post.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
    }
  );

  return Post;
};
