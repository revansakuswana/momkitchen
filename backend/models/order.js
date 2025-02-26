import { DataTypes } from "sequelize";
import db from "../config/database.js";
import users from "./users.js";

const order = db.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: users,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "completed",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

export default order;
