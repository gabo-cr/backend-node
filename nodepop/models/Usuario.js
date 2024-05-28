const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

// método estático que hace hash de una contraseña
usuarioSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 10);
};

// método de instancia que comprueba la password de un usuario
usuarioSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// creamos el modelo de usuarios
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
