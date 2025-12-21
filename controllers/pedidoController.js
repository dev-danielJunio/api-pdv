const db = require('../models');
const Pedido = db.Pedido;
const PedidoVenda = db.PedidoVenda;
const User = db.User;
const Produto = db.Produto;

// Listar todos os pedidos
exports.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
        include: [
            { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
            { model: PedidoVenda, as: 'itens',
                include: [{
                    model: Produto, as: 'produto', attributes: ['sku', 'descricao', 'price']
                }]
            }
        ]
    });
    res.json(pedidos);
  } catch (err) {
    console.error('ERRO AO BUSCAR PEDIDOS:', err); // 🔹 log detalhado
    res.status(500).json({ error: 'Erro ao buscar pedidos', detalhes: err.message });
  }
};