"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("admin123", salt);

    await queryInterface.bulkInsert("users", [
      {
        name: "Admin",
        email: "admin@admin.com",
        password: hashPassword,
        role: "admin",
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "admin@admin.com" });
  },
};
