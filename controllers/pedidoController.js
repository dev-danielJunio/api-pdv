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
    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Nenhum pedido encontrado' });
    }
    res.json(pedidos);
  } catch (err) {
    console.error('ERRO AO BUSCAR PEDIDOS:', err); // 🔹 log detalhado
    res.status(500).json({ error: 'Erro ao buscar pedidos', detalhes: err.message });
  }
};

exports.getPedidoById = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await Pedido.findByPk(id, {
        include: [
            { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
            { model: PedidoVenda, as: 'itens',
                include: [{
                    model: Produto, as: 'produto', attributes: ['sku', 'descricao', 'price']
                }]
            }
        ]
    });
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(pedido);
  } catch (err) {
    console.error(`ERRO AO BUSCAR PEDIDO ID ${id}:`, err); // 🔹 log detalhado
    res.status(500).json({ error: 'Erro ao buscar pedido', detalhes: err.message });
  }
};

exports.createPedido = async (req, res) => {
  const { usuario_id, itens } = req.body;
  try {
    // Verifica se o usuário existe
    const usuario = await User.findByPk(usuario_id);
    if (!usuario) {
      return res.status(400).json({ error: 'Usuário inválido' });
    }
    // Cria o pedido
    const novoPedido = await Pedido.create({ usuario_id, total: 0, data_pedido: new Date() });
    let total = 0;
    // Cria os itens do pedido
    for (const item of itens) {
      const produto = await Produto.findByPk(item.produto_sku);
      console.log(produto);
      if (!produto) {
        return res.status(400).json({ error: `Produto com SKU ${item.produto_sku} não encontrado` });
      }

      const subtotal = Number(produto.price) * item.quantidade;
      total += subtotal - (item.desconto || 0);

      await PedidoVenda.create({
        id_pedido: novoPedido.id,
        produto_sku: item.produto_sku,
        quantidade: item.quantidade,
        subtotal,
        desconto: item.desconto || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await novoPedido.update({ total });
    res.status(201).json({ message: 'Pedido criado com sucesso', pedidoId: novoPedido.id });
  } catch (err) {
    console.error('ERRO AO CRIAR PEDIDO:', err);
    res.status(500).json({ error: 'Erro ao criar pedido', detalhes: err.message });
  }
};

exports.deletePedido = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    await pedido.destroy();
    res.json({ message: 'Pedido deletado com sucesso' });
  }
  catch (err) {
    console.error(`ERRO AO DELETAR PEDIDO ID ${id}:`, err);
    res.status(500).json({ error: 'Erro ao deletar pedido', detalhes: err.message });
  }
};