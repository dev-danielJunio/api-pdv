module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nome: DataTypes.STRING,
    nascimento: DataTypes.DATE,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
  });

  User.associate = (models) => {
    // 1 usuário tem vários pedidos
    User.hasMany(models.Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });
  };

  return User;
};
