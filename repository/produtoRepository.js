const {Produto} = require('../models');

class ProdutoRepository {
    getAllProdutos() {
        return Produto.findAll({ attributes: ['sku', 'nome', 'price', 'descricao'] });
    }

    getProdutoBySku(sku) {
        return Produto.findByPk(sku, { attributes: ['sku', 'nome', 'price', 'descricao'] });
    }

    findByPk(sku) {
        return Produto.findByPk(sku);
    }

    create(data) {
        return Produto.create(data);
    }

    update(sku, data) {
        return Produto.update(data, { where: { sku } });
    }

    delete(sku) {
        return Produto.destroy({ where: { sku } });
    }
}

module.exports = new ProdutoRepository();