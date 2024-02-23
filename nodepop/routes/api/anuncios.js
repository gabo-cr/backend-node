var express = require('express');
var router = express.Router();
const Anuncio = require('../../models/Anuncio');

/** 
 * GET
 * /api/anuncios
 * Devuelve una lista de los anuncios.
 * */
router.get('/', async function(req, res, next) {
	try {
		const filterByName = req.query.name;
		const skip = req.query.skip;
		const limit = req.query.limit;
		const sort = req.query.sort;

		const filter = {};
		if (filterByName) {
			filter.name = filterByName;
		}

		const anuncios = await Anuncio.find(filter);
		if (skip) anuncios.skip(skip);
		if (limit) anuncios.limit(limit);
		if (sort) anuncios.sort(sort)

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
router.get('/:id', async function(req, res, next) {
	try {
		const id = req.params.id;

	  	const anuncio = await Anuncio.findById(id);

	  	res.json({ results: anuncio });
	} catch (error) {
	  	next(error);
	}
  });

/** 
 * POST 
 * /api/anuncios
 * body
 * Crea un anuncio.
 * */
router.post('/', async function(req, res, next) {
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
 * */
router.put('/:id', async function(req, res, next) {
	try {
		const id = req.params.id;
		const data = req.body;

		const anuncioActualizado = Anuncio.findByIdAndUpdate(id, data, { new: true });

		res.json({ result: anuncioActualizado });
	} catch (error) {
		next(error);
	}
});

/** 
 * DELETE
 * /api/anuncios/<_id>
 * Elimina un anuncio.
 * */
router.delete('/:id', async function(req, res, next) {
	try {
	  const id = req.params.id;

	  await Anuncio.deleteOne({ _id: id });

	  res.json();
	} catch (error) {
	  next(error);
	}
});

module.exports = router;
