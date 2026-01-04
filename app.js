const express = require('express');
const app = express();
const sequelize = require('./database/connection');
const errorHandler = require('./middlewares/errorHandler');
app.use(express.json());

// Importa rotas
const pedidoRoutes = require('./routes/pedidoRoutes');

// Usa rotas de pedidos
app.use('/pedidos', pedidoRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco OK');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao conectar ao banco:', err);
    process.exit(1);
  }
})();

module.exports = app;
