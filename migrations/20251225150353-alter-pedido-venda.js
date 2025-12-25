'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('pedido_venda', 'preco_unitario', {
      type: Sequelize.DECIMAL(10, ),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('pedido_venda', 'preco_unitario');
  }
};
