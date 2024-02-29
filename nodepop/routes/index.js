const express = require('express');
const router = express.Router();
const Anuncio = require('../models/Anuncio');

const tipos = [
  { value: '', label: 'Todos' },
  { value: 'venta', label: 'Se vende' },
  { value: 'busca', label: 'Se busca' }
];

const ordenes = [
  { value: 'nombre', label: 'Nombre' },
  { value: 'precio', label: 'Precio' },
  { value: 'venta', label: 'Tipo de anuncio' }
];

const direcciones = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' }
];

/* GET home page. */
router.get('/', async function (req, res, next) {
  const page = 0;

  const filter = {};
  const limit = 6;
  const start = limit * page;
  const sort = 'nombre';
  const dir = 'asc';

  const anuncios = await Anuncio.listarAnuncios(filter, start, limit, sort);
  const tags = await Anuncio.listarTags();

  const allAnunciosCount = await Anuncio.countDocuments();

  const context = {
    title: 'Nodepop',
    anuncios,
    tags,
    tipos,
    ordenes,
    direcciones,
    filterByTags: [],
    sort,
    dir,
    pages: Math.ceil(allAnunciosCount / limit),
    page
  };
  res.render('index', context);
});

router.post('/', async function (req, res, next) {
  const filterByNombre = req.body.nombre;
  const filterByVenta = req.body.venta;
  const filterByPreciomin = req.body.preciomin;
  const filterByPreciomax = req.body.preciomax;
  const filterByTags = req.body.tags;
  let page = req.body.page ? req.body.page : 0;
  const sort = req.body.sort;
  const dir = req.body.dir;

  const filter = {};
  const limit = 6;
  let start = limit * page;
  const sortingBy = dir === 'asc' ? sort : `-${sort}`;

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

  const allAnunciosCount = await Anuncio.find(filter).countDocuments();
  if (allAnunciosCount < start) {
    start = 0;
    page = 0;
  }

  const anuncios = await Anuncio.listarAnuncios(filter, start, limit, sortingBy);
  const tags = await Anuncio.listarTags();

  const context = {
    title: 'Nodepop',
    anuncios,
    tags,
    tipos,
    ordenes,
    direcciones,
    filterByNombre,
    filterByPreciomin,
    filterByPreciomax,
    filterByTags: filterByTags || [],
    filterByVenta,
    sort,
    dir,
    pages: Math.ceil(allAnunciosCount / limit),
    page
  };
  res.render('index', context);
});

module.exports = router;
