const pedidoService = require('../service/pedidoService');

class PedidoController {

  async getAll(req, res, next) {
    try {
      const pedidos = await pedidoService.getAllPedidos();
      res.json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const pedido = await pedidoService.getPedidoById(req.params.id);
      res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const pedido = await pedidoService.createPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const pedido = await pedidoService.updatePedido(req.params.id, req.body);
      res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await pedidoService.deletePedido(req.params.id);
      res.json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PedidoController();
