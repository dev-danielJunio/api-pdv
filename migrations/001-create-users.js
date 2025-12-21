module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: Sequelize.STRING(120),
      nascimento: Sequelize.DATE,
      email: {
        type: Sequelize.STRING(120),
        unique: true,
      },
      senha: Sequelize.STRING(12),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
