const mongoose = require('mongoose');

// Schema de un anuncio
const anuncioSchema = mongoose.Schema({
	nombre: { type: String, required: true, unique:true },
	venta: { type: Boolean },
	precio: { type: Number, required: true, min: 0.0 },
	foto: { type: String },
	tags: [String]
});

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;
