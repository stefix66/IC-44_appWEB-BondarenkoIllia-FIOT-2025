// models/promotion.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Promotion = sequelize.define(
  "Promotion",
  {
    promotionid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // GENERATED ALWAYS AS IDENTITY
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    enddate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // DEFAULT TRUE
    },
  },
  {
    tableName: "promotions",
    timestamps: false,
  }
);
