const express = require('express');
const router = express.Router();

/**
 * GET
 * /api
 * Devuelve una lista de los APIs disponibles.
 * */
router.get('/', async function (req, res, next) {
  try {
    const apis = [
      '/api/anuncios/',
      '/api/tags/'
    ];

    res.json({ apis_disponibles: apis });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
