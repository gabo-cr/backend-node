const express = require('express');
const router = express.Router();

router.get('/:locale', function (req, res, next) {
  const locale = req.params.locale;
  console.log(req);

  res.cookie('nodepop-locale', locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 dias
  });

  res.redirect('back');
});

module.exports = router;
