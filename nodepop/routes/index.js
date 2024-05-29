const express = require('express');
const router = express.Router();
const Anuncio = require('../models/Anuncio');

const getTipos = (req) => ([
  { value: '', label: req.__('Todos') },
  { value: 'venta', label: req.__('Se vende') },
  { value: 'busca', label: req.__('Se busca') }
]);

const getOrdenes = (req) => ([
  { value: 'nombre', label: req.__('Nombre') },
  { value: 'precio', label: req.__('Precio') },
  { value: 'venta', label: req.__('Tipo de anuncio') }
]);

const getDirecciones = (req) => ([
  { value: 'asc', label: req.__('Ascendente') },
  { value: 'desc', label: req.__('Descendente') }
]);

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
  const tipos = getTipos(req);
  const ordenes = getOrdenes(req);
  const direcciones = getDirecciones(req);

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
  const tipos = getTipos(req);
  const ordenes = getOrdenes(req);
  const direcciones = getDirecciones(req);

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
