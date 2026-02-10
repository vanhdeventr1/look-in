"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * 1. Remove the column.
     * Sequelize usually handles dropping the associated
     * foreign key constraint automatically when the column is dropped.
     */
    await queryInterface.removeColumn("datasets", "name");
  },

  async down(queryInterface, Sequelize) {
    /**
     * To undo this, we add the 'name' column back
     * with its original foreign key settings.
     */
    await queryInterface.addColumn("datasets", "name", {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    });
  },
};
