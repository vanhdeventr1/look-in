"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "dataset_images",
        "embedding",
        {
          type: Sequelize.JSON,
          allowNull: true,
          after: "file_path",
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("dataset_images", "embedding", {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
