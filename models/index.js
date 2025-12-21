const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const db = {};

// importa models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Produto = require('./Produto')(sequelize, Sequelize.DataTypes);
db.Pedido = require('./Pedido')(sequelize, Sequelize.DataTypes);
db.PedidoVenda = require('./PedidoVenda')(sequelize, Sequelize.DataTypes);

// executa associções
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
