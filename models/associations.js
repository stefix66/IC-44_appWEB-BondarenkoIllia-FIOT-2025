// models/associations.js
import { User } from "./user.js";
import { Role } from "./role.js";
import { UserRole } from "./userRole.js";

// Many-to-Many: Users <-> Roles через таблицю userroles
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userid",
  otherKey: "roleid",
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleid",
  otherKey: "userid",
});
