const express = require('express');
const router = express.Router();
const Anuncio = require('../models/Anuncio');

/* GET home page. */
router.get('/', async function (req, res, next) {
  const filter = {};
  const start = 0;
  const limit = 0;
  const sort = 'nombre';

  const anuncios = await Anuncio.listarAnuncios(filter, start, limit, sort);
  const tags = await Anuncio.listarTags();

  const context = {
    title: 'Nodepop',
    anuncios,
    tags
  };
  res.render('index', context);
});

module.exports = router;
