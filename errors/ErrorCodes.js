//Erros
module.exports = Object.freeze({
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'Usuário inválido',
    status: 400,
  },

  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: 'Produto não encontrado',
    status: 400,
  },

  INVALID_UNIT_PRICE: {
    code: 'INVALID_UNIT_PRICE',
    message: 'Preço unitário inválido',
    status: 400,
  },

  INVALID_QUANTITY: {
    code: 'INVALID_QUANTITY',
    message: 'Quantidade inválida',
    status: 400,
  },

  INVALID_DISCOUNT: {
    code: 'INVALID_DISCOUNT',
    message: 'Desconto inválido',
    status: 400,
  },

  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Erro interno no servidor',
    status: 500,
  },

  INVALID_ITEMS: {
    code: 'INVALID_ITEMS',
    message: 'Itens do pedido inválidos',
    status: 400,
  },

  PEDIDO_NOT_FOUND: {
    code: 'PEDIDO_NOT_FOUND',
    message: 'Pedido não encontrado',
    status: 404,
  }

});
