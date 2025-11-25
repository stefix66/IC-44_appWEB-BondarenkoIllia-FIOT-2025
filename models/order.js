// models/order.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Order = sequelize.define(
  "Order",
  {
    orderid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // відповідає GENERATED ALWAYS AS IDENTITY
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,    // UserID INT NOT NULL
    },
    orderdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // DEFAULT CURRENT_TIMESTAMP
    },
    totalamount: {
      type: DataTypes.DECIMAL(10, 2), // DECIMAL(10,2)
      allowNull: false,
      // CHECK (TotalAmount >= 0) реалізує сама БД; додатково можна:
      validate: {
        min: 0,
      },
    },
    status: {
      // VARCHAR(20) CHECK IN ('New','Preparing','Delivering','Completed') DEFAULT 'New'
      type: DataTypes.ENUM("New", "Preparing", "Delivering", "Completed"),
      allowNull: false,
      defaultValue: "New",
    },
    paymentmethod: {
      // VARCHAR(20) CHECK IN ('Cash','Card','Online')
      type: DataTypes.ENUM("Cash", "Card", "Online"),
      allowNull: false,
    },
    deliveryaddress: {
      type: DataTypes.TEXT,
      allowNull: false, // DeliveryAddress TEXT NOT NULL
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);
