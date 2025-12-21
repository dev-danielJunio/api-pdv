module.exports = (sequelize, DataTypes) => {
  const PedidoVenda = sequelize.define('PedidoVenda', {
    subtotal: DataTypes.DECIMAL(10, 2),
    quantidade: DataTypes.INTEGER,
    desconto: DataTypes.DECIMAL(10, 2),
  }, {
    tableName: 'pedido_venda', // 🔹 define o nome exato da tabela
    timestamps: true // se quiser createdAt/updatedAt
  });
  PedidoVenda.associate = (models) => {
    // Item de venda pertence a um pedido
    PedidoVenda.belongsTo(models.Pedido, { foreignKey: 'id_pedido', as: 'pedido' });

    // Item de venda pertence a um produto
    PedidoVenda.belongsTo(models.Produto, { foreignKey: 'produto_sku', as: 'produto' });
  };

  return PedidoVenda;
};
