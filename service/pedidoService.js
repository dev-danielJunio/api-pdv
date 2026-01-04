// services/pedidoService.js
const db = require('../models');
const pedidoRepository = require('../repository/pedidoRepository');
const produtoRepository = require('../repository/produtoRepository');
const userRepository = require('../repository/userRepository');
const AppError = require('../errors/AppError');
const ErrorCodes = require('../errors/ErrorCodes');

class PedidoService {

  async getAllPedidos() {
    return pedidoRepository.getAllPedidos();
  }

  async getPedidoById(id) {
    const pedido = await pedidoRepository.getPedidoById(id);
    if (!pedido) {
      throw new AppError({ code: 'PEDIDO_NOT_FOUND', message: 'Pedido não encontrado', status: 404 });
    }
    return pedido;
  }

  async createPedido({ usuario_id, itens }) {
    const transaction = await db.sequelize.transaction();

    try {
      const usuario = await userRepository.getUserById(usuario_id, { transaction });
      if (!usuario) throw new AppError(ErrorCodes.USER_NOT_FOUND);

      const pedido = await pedidoRepository.create({
        usuario_id,
        total: 0,
        data_pedido: new Date()
      }, transaction);

      let total = 0;

      for (const item of itens) {
        const produto = await produtoRepository.getProdutoBySku(item.produto_sku);
        if (!produto) throw new AppError(ErrorCodes.PRODUCT_NOT_FOUND);

        const precoUnitario = item.preco_unitario ?? Number(produto.price);
        if (precoUnitario <= 0) throw new AppError(ErrorCodes.INVALID_UNIT_PRICE);

        if (!item.quantidade || item.quantidade <= 0) {
          throw new AppError(ErrorCodes.INVALID_QUANTITY);
        }

        const subtotal = precoUnitario * item.quantidade;
        const desconto = item.desconto || 0;

        if (desconto < 0 || desconto > subtotal) {
          throw new AppError(ErrorCodes.INVALID_DISCOUNT);
        }

        total += subtotal - desconto;

        await pedidoRepository.createItem({
          id_pedido: pedido.id,
          produto_sku: item.produto_sku,
          quantidade: item.quantidade,
          subtotal,
          desconto,
          createdAt: new Date(),
          updatedAt: new Date(),
          preco_unitario: precoUnitario
        }, transaction );
      }
      await pedidoRepository.update(pedido.id, { total }, transaction);
      await transaction.commit();
      return pedido;
    } catch (error) {
      await transaction.rollback();
      throw error instanceof AppError
        ? error
        : new AppError(ErrorCodes.INTERNAL_ERROR);
    }
  }

  async updatePedido(id, { usuario_id, itens }) {
    const transaction = await db.sequelize.transaction();    
    try {
      const pedido = await pedidoRepository.getPedidoById(id);

      if (!pedido) {
        throw new AppError(ErrorCodes.PEDIDO_NOT_FOUND);
      }

      const usuario = await userRepository.getUserById(usuario_id, { transaction });
      if (!usuario) throw new AppError(ErrorCodes.USER_NOT_FOUND);

      if(itens && itens.length > 0) {
        await pedidoRepository.deleteItemsByPedidoId(id, transaction);
        let total = 0
        for (const item of itens) {
          const produto = await produtoRepository.getProdutoBySku(item.produto_sku);
          if (!produto) throw new AppError(ErrorCodes.PRODUCT_NOT_FOUND);
          
          const precoUnitario = item.preco_unitario ?? Number(produto.price);
          if (precoUnitario <= 0) throw new AppError(ErrorCodes.INVALID_UNIT_PRICE);
          
          if (!item.quantidade || item.quantidade <= 0) {
            throw new AppError(ErrorCodes.INVALID_QUANTITY);
          }
          
          const subtotal = precoUnitario * item.quantidade;
          const desconto = item.desconto || 0;
          
          if (desconto < 0 || desconto > subtotal) {
            throw new AppError(ErrorCodes.INVALID_DISCOUNT);
          }
          total += subtotal - desconto;

          await pedidoRepository.createItem({
            id_pedido: pedido.id,
            produto_sku: item.produto_sku,
            quantidade: item.quantidade,
            subtotal,
            desconto,
            createdAt: new Date(),
            updatedAt: new Date(),
            preco_unitario: precoUnitario
          }, transaction );

        }
        await pedidoRepository.update(id, { total }, transaction);
      }
      await transaction.commit();
      return pedido;
    } catch (error) {
      await transaction.rollback();
      throw error instanceof AppError
        ? error
        : new AppError(ErrorCodes.INTERNAL_ERROR);
    }
  }

  async deletePedido(id) {
    const pedido = await pedidoRepository.getPedidoById(id);
    if (!pedido) {
      throw new AppError(errorCodes.PEDIDO_NOT_FOUND);
    }
    await pedidoRepository.delete(id);
  }
}

module.exports = new PedidoService();
