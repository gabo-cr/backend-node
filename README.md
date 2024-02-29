# Bootcamp KeepCoding

## Módulo: Backend con Node.js y MongoDB

Este repositorio contiene la solución al proyecto propuesto en este módulo, que consiste en la creación de una aplicación web para un servicio de venta y búsqueda de artículos de segunda mano, que llamaremos Nodepop. La aplicación debe exponer un API y mostrar una página con los anuncios de los artículos.

## Contenido

El repositorio contiene el proyecto `nodepop`, desarrollado en Node.js, utilizando [Express.js](https://expressjs.com/en/starter/generator.html). Como base de datos utiliza [MongoDB](https://www.mongodb.com/try/download/community), y como motor de templates, [Nunjucks](https://mozilla.github.io/nunjucks/).

## Instalación

Una vez descargado el repositorio, se debe colocar dentro de la carpeta nodepop e instalar las dependencias:

```javascript
cd nodepop
npm install
```

Para cargar datos iniciales de prueba, se puede correr el siguiente comando:

```javascript
npm run init-db
```

En la terminal, aparecerá un mensaje preguntando si desea continuar, ya que se borrarán todos los registros de la base de datos para volver a cargar los de prueba. Si desea continuar, basta con responder `si`. Si no desea continuar, basta con darle `enter`.

## Development

Para correr la aplicación web en un entorno de desarrollo:

```javascript
npm run dev
```

La aplicación corre en [http://localhost:3000/](http://localhost:3000/).

El API se puede visualizar en [http://localhost:3000/api](http://localhost:3000/api).

## API

### Anuncios

#### Lista de anuncios

GET /api/anuncios

Autenticación:

```javascript
No requiere autenticación.
```

Params:

```javascript
?nombre=bici            // Nombre que empiece con 'bici'

?venta=true             // Anuncios de artículos que se venden
?venta=false            // Anuncios de artículos que se buscan

?precio=20.00           // Precio igual a 20.00
?precio=20.00-          // Precio mayor o igual a 20.00
?precio=-20.00          // Precio menor o igual a 20.00
?precio=20.00-50.00     // Precio mayor o igual a 20.00 y menor o igual 50.00

?tags=mobile            // Anuncios de artículos que tengan el tag mobile
?tags=mobile&tags=motor // Anuncios de artículos que tengan al menos uno de estos tags: mobile o motor

?start=0                // Anuncios a partir del primero
?start=6                // Anuncios a partir del sexto

?limit=3                // Limita la respuesta a solo 3 anuncios

?sort=precio            // Ordena la respuesta por precio de forma ascendente
?sort=-precio           // Ordena la respuesta por precio de forma descendente
```

Respuesta 200:

```json
{
    "results": [
        {
            "_id": "65dfb10bd7fff4beb45a6c61",
            "nombre": "Bicicleta",
            "venta": true,
            "precio": 230.15,
            "foto": "/images/anuncios/bicicleta.jpg",
            "tags": [
                "lifestyle",
                "motor"
            ],
            "__v": 0
        },
        {
            "_id": "65dfb10bd7fff4beb45a6c62",
            "nombre": "iPhone 11",
            "venta": false,
            "precio": 50,
            "foto": "/images/anuncios/iphone11.jpg",
            "tags": [
                "lifestyle",
                "mobile"
            ],
            "__v": 0
        }
    ]
}
```

#### Anuncio individual

GET /api/anuncios/:id

Autenticación:

```javascript
No requiere autenticación.
```

Params:

```javascript
No necesita enviar ningún parámetro en la URL.
```

Respuesta 200:

```json
{
    "result": {
        "_id": "65dfb10bd7fff4beb45a6c62",
        "nombre": "iPhone 11",
        "venta": false,
        "precio": 50,
        "foto": "/images/anuncios/iphone11.jpg",
        "tags": [
            "lifestyle",
            "mobile"
        ],
        "__v": 0
    }
}
```

#### Crear un anuncio

POST /api/anuncios

Autenticación:

```javascript
Basic Auth
username: admin
password: 1234
```

Body (JSON):

```json
{
    "nombre": "Nuevo producto",
    "venta": true,
    "precio": 102.53,
    "tags": [
        "mobile",
        "motor"
    ]
}
```

Respuesta 200:

```json
{
    "result": {
        "nombre": "Nuevo producto",
        "venta": true,
        "precio": 102.53,
        "tags": [
            "mobile",
            "motor"
        ],
        "_id": "65e0dcd766a37c42703a6627",
        "__v": 0
    }
}
```

#### Actualizar un anuncio

PUT /api/anuncios/:id

Autenticación:

```javascript
Basic Auth
username: admin
password: 1234
```

Body (JSON):

```json
{
    "nombre": "Nuevo nombre",
    "venta": true,
    "precio": 105.11,
    "tags": [
        "mobile"
    ]
}
```

Respuesta 200:

```json
{
    "result": {
        "_id": "65e0dcd766a37c42703a6627",
        "nombre": "Nuevo nombre",
        "venta": true,
        "precio": 105.11,
        "tags": [
            "mobile"
        ],
        "__v": 0
    }
}
```

#### Eliminar un anuncio

DELETE /api/anuncios/:id

Autenticación:

```javascript
Basic Auth
username: admin
password: 1234
```

Body (JSON):

```javascript
No necesita enviar ningún elemento.
```

Respuesta 200:

```javascript
No devuelve ningún elemento, solo el status 200.
```

### Tags

#### Lista de tags

GET /api/tags

Autenticación:

```javascript
No requiere autenticación.
```

Params:

```javascript
No necesita enviar ningún parámetro en la URL.
```

Respuesta 200:

```json
{
    "results": [
        "antique",
        "housing",
        "lifestyle",
        "mobile",
        "motor",
        "sports",
        "work"
    ]
}
```
