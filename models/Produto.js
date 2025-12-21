module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    sku: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
  });

  Produto.associate = (models) => {
    // 1 produto pode estar em vários itens de venda
    Produto.hasMany(models.PedidoVenda, { foreignKey: 'produto_sku', as: 'vendas' });
  };

  return Produto;
};
