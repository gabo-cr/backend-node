const multer = require('multer');
const path = require('node:path');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const route = path.join(__dirname, '..', 'public', 'images', 'anuncios');
    callback(null, route);
  },
  filename: function (req, file, callback) {
    try {
      const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`;
      callback(null, filename);
    } catch (error) {
      callback(error);
    }
  }
});

const upload = multer({ storage });

module.exports = upload;
