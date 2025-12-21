module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('Pedido', {
    total: DataTypes.DECIMAL(10, 2),
    data_pedido: DataTypes.DATE,
  });

  Pedido.associate = (models) => {
    // Pedido pertence a um usuário
    Pedido.belongsTo(models.User, { foreignKey: 'usuario_id', as: 'usuario' });

    // Pedido tem vários itens
    Pedido.hasMany(models.PedidoVenda, { foreignKey: 'id_pedido', as: 'itens' });
  };

  return Pedido;
};
