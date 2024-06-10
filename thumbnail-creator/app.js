'use strict';

const path = require('node:path');
const jimp = require('jimp');
const { Responder } = require('cote');

const responder = new Responder({ name: 'thumbnail creator microservice' });

responder.on('create-thumbnail', (req, done) => {
	const { filename } = req;

	console.log(Date.now(), 'servicio:', filename);
	
	const route = path.join(__dirname, '..', 'nodepop','public', 'images', 'anuncios');
	
	const dotIndex = filename.lastIndexOf('.');
	const newRoute = path.join(__dirname, '..', 'nodepop','public', 'images', 'anuncios', 'thumbnails');
	const newFilename = `${filename.slice(0, dotIndex)}-thumbnail.${filename.slice(dotIndex+1)}`;

	jimp.read(`${route}/${filename}`, (err, image) => {
		if (err) throw err;
		image
			.scaleToFit(100, 100)
			.write(`${newRoute}/${newFilename}`);
	});

	done(`Guardada en ${newRoute}/${newFilename}`);
});
