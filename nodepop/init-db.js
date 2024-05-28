'use strict';

require('dotenv').config();

const readline = require('node:readline');
const connection = require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');
const Usuario = require('./models/Usuario');
const initData = require('./init-data.json');

main().catch(err => console.log('Hubo un error', err));

async function main () {
  // Esperar a que se conecte a la Base de datos
  await new Promise((resolve) => connection.once('open', resolve));

  const borrar = await pregunta('¿Estás seguro de querer borrar todo el contenido de la base de datos? [si/no] (no) ');
  if (!borrar) {
    process.exit();
  }

  await initAnuncios();
  await initUsuarios();

  connection.close();
}

async function initAnuncios () {
  // elimino todos los anuncios
  const deleted = await Anuncio.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

  // inserto los nuevos anuncios desde el archivo init-data.json
  const inserted = await Anuncio.insertMany(initData.anuncios);
  console.log(`Creados ${inserted.length} anuncios.`);
}

async function initUsuarios () {
  // elimino todos los usuarios
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // inserto los nuevos usuarios desde el archivo init-data.json
  const inserted = await Usuario.insertMany([
    { email: 'user@example.com', password: await Usuario.hashPassword('1234') },
    { email: 'gabriel@example.com', password: await Usuario.hashPassword('1234') }
  ]);
  console.log(`Creados ${inserted.length} usuarios.`);
}

function pregunta (texto) {
  return new Promise((resolve, reject) => {
    // conectar readline con la consola
    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    ifc.question(texto, respuesta => {
      ifc.close();
      resolve(respuesta.toLowerCase() === 'si');
    });
  });
}
