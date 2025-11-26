// controllers/publicOrdersController.js

import { User } from "../models/user.js";
import { MenuItem } from "../models/menuItem.js";
import { Order } from "../models/order.js";
import { OrderItem } from "../models/orderItem.js";

// Публічне створення замовлення з форми на сайті
export const createPublicOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      menuItems,   // масив ID страв з селекту
      payment,     // Cash / Card / Online
      comment,     // поки просто лог, у БД не пишемо
    } = req.body;

    if (
      !name ||
      !email ||
      !address ||
      !Array.isArray(menuItems) ||
      menuItems.length === 0
    ) {
      return res.status(400).json({ message: "Некоректні дані замовлення" });
    }

    // 1. Знаходимо або створюємо користувача за email
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        name,
        email,
        phone,
        address,
        // тимчасовий пароль, в наступній лабі заміниш на нормальну реєстрацію
        password: "temp_password",
      });
    } else {
      // легке оновлення телефону/адреси
      await user.update({
        phone: phone ?? user.phone,
        address: address ?? user.address,
      });
    }

    // 2. Отримуємо обрані страви
    const items = await MenuItem.findAll({
      where: {
        menuitemid: menuItems,
      },
    });

    if (!items.length) {
      return res.status(400).json({ message: "Обрані страви не знайдено" });
    }

    // 3. Рахуємо суму замовлення (сума цін усіх вибраних страв)
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price;
    }, 0);

    // 4. Створюємо замовлення
    const order = await Order.create({
      userid: user.userid,
      totalamount: totalAmount,
      paymentmethod: payment,    // Cash / Card / Online
      deliveryaddress: address,
      // status → "New" за замовчуванням
      // orderdate → NOW за замовчуванням
    });

    // 5. Створюємо позиції замовлення (OrderItems)
    // поки що кожна обрана страва = quantity 1
    const orderItemsToCreate = items.map((item) => ({
      orderid: order.orderid,
      menuitemid: item.menuitemid,
      quantity: 1,
      subtotal: item.price,
    }));

    await OrderItem.bulkCreate(orderItemsToCreate);

    console.log("New public order comment:", comment); // щоб не пропало зовсім 🙂

    return res.status(201).json({
      message: "Order created successfully",
      order,
      orderItems: orderItemsToCreate,
    });
  } catch (error) {
    console.error("Error creating public order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};
