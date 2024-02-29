const express = require('express');
const router = express.Router();
const Anuncio = require('../models/Anuncio');

/* GET home page. */
router.get('/', async function (req, res, next) {
  const filterByNombre = req.query.nombre;
  const filterByVenta = req.query.venta;
  const filterByPreciomin = req.query.preciomin;
  const filterByPreciomax = req.query.preciomax;
  const filterByTags = req.query.tags;
  const page = req.query.page;

  const filter = {};
  const limit = 6;
  const start = limit * page;
  const sort = 'nombre';

  if (filterByNombre) {
    filter.nombre = new RegExp('^' + filterByNombre, 'i');
  }
  if (filterByVenta) {
    filter.venta = filterByVenta === 'venta';
  }
  if (filterByTags) {
    filter.tags = { $in: filterByTags };
  }
  if (filterByPreciomin && filterByPreciomax) {
    filter.precio = { $lte: filterByPreciomax, $gte: filterByPreciomin };
  } else if (filterByPreciomin && !filterByPreciomax) {
    filter.precio = { $gte: filterByPreciomin };
  } else if (!filterByPreciomin && filterByPreciomax) {
    filter.precio = { $lte: filterByPreciomax };
  }

  const anuncios = await Anuncio.listarAnuncios(filter, start, limit, sort);
  const tags = await Anuncio.listarTags();
  const tipos = [
    { value: '', label: 'Todos' },
    { value: 'venta', label: 'Se vende' },
    { value: 'busca', label: 'Se busca' }
  ];

  const len = await Anuncio.countDocuments();

  const context = {
    title: 'Nodepop',
    anuncios,
    tags,
    tipos,
    filterByNombre,
    filterByPreciomin,
    filterByPreciomax,
    filterByTags: filterByTags || [],
    filterByVenta,
    pages: Math.ceil(len / limit),
    page
  };
  res.render('index', context);
});

module.exports = router;
