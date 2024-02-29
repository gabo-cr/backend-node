const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const basicAuth = require('../../lib/basicAuthMiddleware');

/**
 * GET
 * /api/anuncios
 * Devuelve una lista de los anuncios.
 * */
router.get('/', async function (req, res, next) {
  try {
    const filterByNombre = req.query.nombre;
    const filterByVenta = req.query.venta;
    const filterByPrecio = req.query.precio;
    const filterByTags = req.query.tags;
    const start = req.query.start;
    const limit = req.query.limit;
    const sort = req.query.sort;

    const filter = {};
    if (filterByNombre) {
      filter.nombre = new RegExp('^' + filterByNombre, 'i');
    }
    if (filterByVenta) {
      filter.venta = filterByVenta;
    }
    if (filterByPrecio) {
      const indexSeparador = filterByPrecio.indexOf('-');
      if (indexSeparador === -1) {
        filter.precio = filterByPrecio;
      } else if (indexSeparador === 0) {
        filter.precio = { $lte: filterByPrecio.slice(1) };
      } else if (indexSeparador === (filterByPrecio.length - 1)) {
        filter.precio = { $gte: filterByPrecio.slice(0, filterByPrecio.length - 1) };
      } else {
        const min = filterByPrecio.slice(0, indexSeparador);
        const max = filterByPrecio.slice(indexSeparador + 1);
        filter.precio = { $lte: max, $gte: min };
      }
    }
    if (filterByTags) {
      filter.tags = { $in: filterByTags };
    }

    const anuncios = await Anuncio.listarAnuncios(filter, start, limit, sort);

    res.json({ results: anuncios });
  } catch (error) {
    next(error);
  }
});

/**
 * GET
 * /api/anuncios/<_id>
 * Devuelve un anuncio.
 * */
router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;

    const anuncio = await Anuncio.findById(id);

    res.json({ result: anuncio });
  } catch (error) {
    next(error);
  }
});

/**
 * POST
 * /api/anuncios
 * body
 * Crea un anuncio.
 * Requiere autenticación.
 * */
router.post('/', basicAuth, async function (req, res, next) {
  try {
    const data = req.body;

    const anuncio = new Anuncio(data);
    const anuncioGuardado = await anuncio.save();

    res.json({ result: anuncioGuardado });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT
 * /api/anuncios
 * body
 * Actualiza un anuncio.
 * Requiere autenticación.
 * */
router.put('/:id', basicAuth, async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;

    const anuncioActualizado = await Anuncio.findByIdAndUpdate(id, data, { new: true });

    res.json({ result: anuncioActualizado });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE
 * /api/anuncios/<_id>
 * Elimina un anuncio.
 * Requiere autenticación.
 * */
router.delete('/:id', basicAuth, async function (req, res, next) {
  try {
    const id = req.params.id;

    await Anuncio.deleteOne({ _id: id });

    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
