const mongoose = require('mongoose');

// Schema de un anuncio
const anuncioSchema = mongoose.Schema({
  nombre: { type: String, required: true, unique: true, index: true },
  venta: { type: Boolean, index: true },
  precio: { type: Number, required: true, min: 0.0, index: true },
  foto: { type: String },
  tags: { type: [String], index: true },
  owner: { ref: 'Usuario', type: mongoose.Schema.ObjectId, index: true }
});

anuncioSchema.statics.listarAnuncios = function (filtro, skip, limit, sort) {
  const query = Anuncio.find(filtro);
  query.skip(skip);
  query.limit(limit);
  query.collation({ locale: 'en' }).sort(sort);
  return query.exec();
};

anuncioSchema.statics.listarTags = function () {
  const query = Anuncio.distinct('tags');
  return query.exec();
};

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;
