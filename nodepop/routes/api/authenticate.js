const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario');
const jwt = require('jsonwebtoken');

router.post('/', async function (req, res, next) {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    // si no lo encuentro o no coincide la contraseña --> error
    if (!usuario || !(await usuario.comparePassword(password))) {
      res.json({ error: 'Invalid credentials' });
      return;
    }

    const tokenJWT = await jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ tokenJWT });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
