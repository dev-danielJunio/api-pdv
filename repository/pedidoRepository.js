const { Pedido, PedidoVenda, User } = require('../models');

class PedidoRepository {

  getAllPedidos() {
    return Pedido.findAll({
      attributes: ['id', 'total', 'data_pedido'],
        include: [
            { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
            { model: PedidoVenda, as: 'itens', attributes: ['id', 'produto_sku', 'quantidade', 'preco_unitario', 'subtotal', 'desconto']}
        ]
    });
  }

  getPedidoById(id) {
    return Pedido.findByPk(id, {
      include: [
        { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: PedidoVenda, as: 'itens' }
      ]
    });
  }

  create(data, transaction) {
    return Pedido.create(data, { transaction });
  }

  update(id, data, transaction) {
    return Pedido.update(data, { where: { id }, transaction });
  }

  createItem(data, transaction) {
    return PedidoVenda.create(data, { transaction });
  }

  deleteItemsByPedidoId(pedidoId, transaction) {
    return PedidoVenda.destroy({
      where: { id_pedido: pedidoId },
      transaction
    });
  }


  delete(id) {
    return Pedido.destroy({ where: { id } });
  }
}

module.exports = new PedidoRepository();
