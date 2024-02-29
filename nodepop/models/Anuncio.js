const mongoose = require('mongoose');

// Schema de un anuncio
const anuncioSchema = mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  venta: { type: Boolean },
  precio: { type: Number, required: true, min: 0.0 },
  foto: { type: String },
  tags: [String]
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
