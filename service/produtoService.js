const produtoRepository = require('../repository/produtoRepository');
const AppError = require('../errors/AppError');
const ErrorCodes = require('../errors/ErrorCodes');

class ProdutoService {
    async getAllProdutos() {
        return produtoRepository.getAllProdutos();
    }

    async getProdutoBySku(sku) {
        const produto = await produtoRepository.getProdutoBySku(sku);
        if (!produto) {
            throw new AppError(ErrorCodes.PRODUCT_NOT_FOUND);
        }
        return produto;
    }

    async createProduto(data) {
        return produtoRepository.create(data);
    }

    async updateProduto(sku, data) {
        const produto = await this.getProdutoBySku(sku);
        await produtoRepository.update(sku, data);
        return this.getProdutoBySku(sku);
    }

    async deleteProduto(sku) {
        const produto = await this.getProdutoBySku(sku);
        if (!produto) {
            throw new AppError(ErrorCodes.PRODUCT_NOT_FOUND);
        }
        await produtoRepository.delete(sku);
    }
}