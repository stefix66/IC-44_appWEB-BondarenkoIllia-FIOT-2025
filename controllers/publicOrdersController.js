// controllers/publicOrdersController.js
import { Order } from "../models/order.js";
import { OrderItem } from "../models/orderItem.js";
import { MenuItem } from "../models/menuItem.js";

// POST /api/public/orders  (тільки для авторизованих користувачів)
export const createPublicOrder = async (req, res) => {
  try {
    // id користувача беремо з токена (auth middleware вже розпарсив JWT)
    const userId = req.user?.userid || req.user?.userId || req.user?.id;

    console.log("✨ createPublicOrder | req.user:", req.user);
    console.log("✨ createPublicOrder | userId:", userId);

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: no user id in token" });
    }

    const { menuItems, payment, address, comment } = req.body;

    // 1) Валідація простих полів
    if (!Array.isArray(menuItems) || menuItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Обов'язково оберіть хоча б одну страву" });
    }

    if (!address) {
      return res
        .status(400)
        .json({ message: "Адреса доставки є обов'язковою" });
    }

    if (!["Cash", "Card", "Online"].includes(payment)) {
      return res.status(400).json({ message: "Невірний спосіб оплати" });
    }

    // 2) Завантажуємо страви з БД
    const dbItems = await MenuItem.findAll({
      where: { menuitemid: menuItems }, // menuItems — масив id
    });

    if (!dbItems.length) {
      return res
        .status(400)
        .json({ message: "Обрані страви не знайдені" });
    }

    // 3) Обчислюємо загальну суму
    let totalAmount = 0;

    dbItems.forEach((item) => {
      const priceNumber = Number(item.price);
      if (!isNaN(priceNumber)) {
        totalAmount += priceNumber;
      }
    });

    // 4) Створюємо запис у Orders
    const newOrder = await Order.create({
      userid: userId,
      totalamount: totalAmount,
      paymentmethod: payment,
      deliveryaddress: address,
      status: "New",
    });

    // 5) Створюємо OrderItems (кожна обрана страва — кількість 1)
    const orderItemsToCreate = dbItems.map((item) => {
      const priceNumber = Number(item.price) || 0;
      return {
        orderid: newOrder.orderid,
        menuitemid: item.menuitemid,
        quantity: 1,
        subtotal: priceNumber,
      };
    });

    const createdItems = await OrderItem.bulkCreate(orderItemsToCreate);

    // 6) Відповідь клієнту
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      items: createdItems,
      comment: comment || null, // поки просто повертаємо, у БД не зберігаємо
    });
  } catch (error) {
    console.error("Error creating public order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};
