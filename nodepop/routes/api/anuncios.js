const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const upload = require('../../lib/publicUploadConfig');
const { Requester } = require('cote');

/**
 * GET
 * /api/anuncios
 * Devuelve una lista de los anuncios.
 * */
router.get('/', async function (req, res, next) {
  try {
    const userId = req.apiUserId;

    // filtros
    const filterByNombre = req.query.nombre;
    const filterByVenta = req.query.venta;
    const filterByPrecio = req.query.precio;
    const filterByTags = req.query.tags;

    // paginación
    const start = req.query.start;
    const limit = req.query.limit;

    // ordenamiento
    const sort = req.query.sort;

    const filter = { owner: userId };
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
    const userId = req.apiUserId;
    const id = req.params.id;

    const anuncio = await Anuncio.find({ _id: id, owner: userId });

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
router.post('/', upload.single('foto'), async function (req, res, next) {
  try {
    const userId = req.apiUserId;
    const data = req.body;

    const foto = req.file;

    const anuncio = new Anuncio({ ...data, owner: userId, foto: foto.filename });
    const anuncioGuardado = await anuncio.save();

    const requester = new Requester({ name: 'nodepop-app' });
    const evento = {
      type: 'create-thumbnail',
      filename: foto.filename
    };
    requester.send(evento, result => {
      console.log(Date.now(), 'nodepop-app obtiene el resultado:', result);
    });

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
router.put('/:id', async function (req, res, next) {
  try {
    const userId = req.apiUserId;
    const id = req.params.id;
    const data = req.body;

    const anuncioActualizado = await Anuncio.findOneAndUpdate({ _id: id, owner: userId }, data, { new: true });

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
router.delete('/:id', async function (req, res, next) {
  try {
    const userId = req.apiUserId;
    const id = req.params.id;

    await Anuncio.deleteOne({ _id: id, owner: userId });

    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
