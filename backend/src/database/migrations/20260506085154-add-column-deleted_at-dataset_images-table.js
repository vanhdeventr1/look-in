module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("dataset_images", "deleted_at", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "updated_at",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("dataset_images", "deleted_at");
  },
};
