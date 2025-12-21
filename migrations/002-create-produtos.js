module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('produtos', {
      sku: {
        type: Sequelize.STRING(10),
        primaryKey: true,
      },
      nome: Sequelize.STRING(20),
      descricao: Sequelize.STRING(120),
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('produtos');
  },
};
