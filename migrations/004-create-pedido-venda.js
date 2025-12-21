module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedido_venda', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_pedido: {
        type: Sequelize.INTEGER,
        references: {
          model: 'pedidos',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      produto_sku: {
        type: Sequelize.STRING(10),
        references: {
          model: 'produtos',
          key: 'sku',
        },
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      desconto: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('pedido_venda');
  },
};
