const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

/**
 * GET
 * /api/tags
 * Devuelve una lista de los tags.
 * */
router.get('/', async function (req, res, next) {
  try {
    const tags = await Anuncio.listarTags();

    res.json({ results: tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
