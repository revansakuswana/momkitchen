import { DataTypes } from "sequelize";
import db from "../config/database.js";
import order from "./order.js";
import food from "./food.js";

const orderItem = db.define(
  "order_item",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: order,
        key: "id",
      },
    },
    foodId: {
      type: DataTypes.INTEGER,
      references: {
        model: food,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
    underscored: true,
  }
);

export default orderItem;
