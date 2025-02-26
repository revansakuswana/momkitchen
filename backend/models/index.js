import users from "../models/users.js";
import order from "../models/order.js";
import food from "../models/food.js";
import orderItem from "../models/orderItem.js";

// Relasi User - Order (One-to-Many)
users.hasMany(order, { foreignKey: "userId" });
order.belongsTo(users, { foreignKey: "userId" });

// Relasi order - orderItem (One-to-Many)
order.hasMany(orderItem, { foreignKey: "orderId" });
order.hasMany(orderItem, { foreignKey: "orderId", as: "items" });
orderItem.belongsTo(order, { foreignKey: "orderId" });

// Relasi Food - orderItem (One-to-Many)
food.hasMany(orderItem, { foreignKey: "foodId" });
orderItem.belongsTo(food, { foreignKey: "foodId" });

export { users, food, order, orderItem };
