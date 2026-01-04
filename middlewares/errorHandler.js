// middlewares/errorHandler.js
const AppError = require('../errors/AppError');

module.exports = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
  }

  console.error('ERRO NÃO TRATADO:', error);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno no servidor',
      details: null
    }
  });
};
