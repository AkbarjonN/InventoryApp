import UserModel from "./Users.js";
import InventoryModel from "./Inventory.js";
import ItemModel from "./Item.js";
import FieldModel from "./Field.js";
import FieldValueModel from "./FieldValue.js";
import PostModel from "./Post.js";
import LikeModel from "./Like.js";

export default function initModels(sequelize) {
  const User = UserModel(sequelize);
  const Inventory = InventoryModel(sequelize);
  const Item = ItemModel(sequelize);
  const Field = FieldModel(sequelize);
  const FieldValue = FieldValueModel(sequelize);
  const Post = PostModel(sequelize);
  const Like = LikeModel(sequelize);

  // 🔗 Relationships
  User.hasMany(Inventory, { foreignKey: "userId" });
  Inventory.belongsTo(User, { foreignKey: "userId" });

  Inventory.hasMany(Item, { foreignKey: "inventoryId" });
  Item.belongsTo(Inventory, { foreignKey: "inventoryId" });

  Inventory.hasMany(Field, { foreignKey: "inventoryId" });
  Field.belongsTo(Inventory, { foreignKey: "inventoryId" });

  Item.hasMany(FieldValue, { foreignKey: "itemId" });
  FieldValue.belongsTo(Item, { foreignKey: "itemId" });

  Field.hasMany(FieldValue, { foreignKey: "fieldId" });
  FieldValue.belongsTo(Field, { foreignKey: "fieldId" });

  Inventory.hasMany(Post, { foreignKey: "inventoryId" });
  Post.belongsTo(Inventory, { foreignKey: "inventoryId" });

  User.hasMany(Post, { foreignKey: "userId" });
  Post.belongsTo(User, { foreignKey: "userId" });

  Post.hasMany(Like, { foreignKey: "postId" });
  Like.belongsTo(Post, { foreignKey: "postId" });

  User.hasMany(Like, { foreignKey: "userId" });
  Like.belongsTo(User, { foreignKey: "userId" });

  return { User, Inventory, Item, Field, FieldValue, Post, Like };
}
