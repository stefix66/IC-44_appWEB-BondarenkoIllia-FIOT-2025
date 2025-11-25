// models/orderItem.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const OrderItem = sequelize.define(
  "OrderItem",
  {
    orderitemid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    orderid: {
      type: DataTypes.INTEGER,
      allowNull: false, // FK to Orders
    },
    menuitemid: {
      type: DataTypes.INTEGER,
      allowNull: false, // FK to MenuItems
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // CHECK (Quantity > 0)
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, // CHECK (Subtotal >= 0)
      },
    },
  },
  {
    tableName: "orderitems",
    timestamps: false,
  }
);
