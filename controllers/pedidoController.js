const db = require('../models');
const Pedido = db.Pedido;
const PedidoVenda = db.PedidoVenda;
const User = db.User;
const Produto = db.Produto;

// Listar todos os pedidos
exports.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      attributes: ['id', 'total', 'data_pedido'],
        include: [
            { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
            { model: PedidoVenda, as: 'itens', attributes: ['id', 'produto_sku', 'quantidade', 'preco_unitario', 'subtotal', 'desconto']}
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

  const transaction = await db.sequelize.transaction();
  try {
    // Verifica se o usuário existe
    const usuario = await User.findByPk(usuario_id, {transaction});
    if (!usuario) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Usuário inválido' });
    }
    // Cria o pedido
    const novoPedido = await Pedido.create({
      usuario_id, total: 0, data_pedido: new Date()
    }, { transaction });

    let total = 0;
    // Cria os itens do pedido
    for (const item of itens) {
      const produto = await Produto.findByPk(item.produto_sku, {transaction});
      if (!produto) {
        await transaction.rollback();
        return res.status(400).json({ error: `Produto com SKU ${item.produto_sku} não encontrado` });
      }
      
      const precoUnitario = item.preco_unitario ?? Number(produto.price);
      
      if(precoUnitario <= 0) {
        await transaction.rollback();
        return res.status(400).json({ error: `Preço unitário inválido para o produto SKU ${item.produto_sku}` });
      }

      const subtotal = precoUnitario * item.quantidade;
      const desconto = item.desconto || 0;
      total += subtotal - desconto;
      console.log(precoUnitario)
      await PedidoVenda.create({
        id_pedido: novoPedido.id,
        produto_sku: item.produto_sku,
        quantidade: item.quantidade,
        subtotal,
        desconto,
        createdAt: new Date(),
        updatedAt: new Date(),
        preco_unitario: precoUnitario
      }, { transaction });
    }
    await novoPedido.update({ total }, {transaction});
    await transaction.commit();
    res.status(201).json({ message: 'Pedido criado com sucesso', pedidoId: novoPedido.id });
  } catch (err) {
    //console.error('ERRO AO CRIAR PEDIDO:', err);
    res.status(500).json({ error: 'Erro ao criar pedido', detalhes: err.message });
  }
};

exports.updatePedido = async (req, res) => {
  const { id } = req.params;
  const { usuario_id, itens } = req.body;

  const transaction = await db.sequelize.transaction();

  try {
    const pedido = await Pedido.findByPk(id, { transaction });

    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (usuario_id) {
      const usuario = await User.findByPk(usuario_id);
      if (!usuario) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Usuário inválido' });
      }
      pedido.usuario_id = usuario_id;
    }

    if(itens && itens.length > 0) {
      await PedidoVenda.destroy({ where: { id_pedido: id }, transaction });
      let total = 0;
      for (const item of itens) {
        const produto = await Produto.findByPk(item.produto_sku);
        if (!produto) {
          await transaction.rollback();
          return res.status(400).json({ error: `Produto com SKU ${item.produto_sku} não encontrado` });
        }
        const precoUnitario = item.preco_unitario ?? Number(produto.price);
        
        if(precoUnitario <= 0) {
          await transaction.rollback();
          return res.status(400).json({ error: `Preço unitário inválido para o produto SKU ${item.produto_sku}` });
        }
        const subtotal = precoUnitario * item.quantidade;
        const desconto = item.desconto || 0;
        total += subtotal - desconto;
        await PedidoVenda.create({
          id_pedido: pedido.id,
          produto_sku: item.produto_sku,
          quantidade: item.quantidade,
          subtotal,
          desconto,
          createdAt: new Date(),
          updatedAt: new Date(),
          preco_unitario: precoUnitario
        }, { transaction });
      }
      pedido.total = total;
    }
    await pedido.save({ transaction });
    await transaction.commit();
    res.json({ message: 'Pedido atualizado com sucesso' });
  }
  catch (err) {
    await transaction.rollback();
    console.error(`ERRO AO ATUALIZAR PEDIDO ID ${id}:`, err);
    res.status(500).json({ error: 'Erro ao atualizar pedido', detalhes: err.message });
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