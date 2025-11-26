import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import usersRoutes from "./routes/users.js";
import menuItemsRoutes from "./routes/menuitems.js"; 
import ordersRoutes from "./routes/orders.js";
import orderItemsRoutes from "./routes/orderitems.js";
import promotionsRoutes from "./routes/promotions.js";
import publicOrdersRoutes from "./routes/publicOrders.js";




dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();


app.use("/api/users", usersRoutes);
app.use("/api/menuitems", menuItemsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderitems", orderItemsRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/public/orders", publicOrdersRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
