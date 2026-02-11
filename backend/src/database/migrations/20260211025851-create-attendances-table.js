"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendances", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      clock_in: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      shift_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_late: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      late_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      permit_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "permits",
          key: "id",
        },
      },
      gps_lat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gps_lng: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
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
    await queryInterface.dropTable("attendances");
  },
};
