"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance_settings", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      gps_lat: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gps_lng: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      radius_meter: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      check_in_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      check_out_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attendance_settings");
  },
};
