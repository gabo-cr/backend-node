# Bootcamp KeepCoding

## Módulos: Backend Inicial y Avanzado con Node.js y MongoDB

Este repositorio contiene la solución al proyecto propuesto en los módulos de Backend y Backend Avanzado con Node.js y MongoDB, que consiste en la creación de una aplicación web para un servicio de venta y búsqueda de artículos de segunda mano, que llamaremos Nodepop.

La aplicación:

- Expone un API, protegido por autenticación JWT.
- Muestra una página internacionalizada con los anuncios de los artículos y sus filtros.
- Se conecta con un microservicio para crear thumbnails.

## Contenido

El repositorio contiene el proyecto principal `nodepop`, desarrollado en Node.js, utilizando [Express.js](https://expressjs.com/en/starter/generator.html). Como base de datos utiliza [MongoDB](https://www.mongodb.com/try/download/community), y como motor de templates, [Nunjucks](https://mozilla.github.io/nunjucks/).

El repositorio también contiene el microservicio `thumbnail-creator`, desarrollado en Node.js.

## Instalación de Nodepop

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

Para correr nodepop en un entorno de desarrollo:

```javascript
npm run dev
```

La aplicación corre en [http://localhost:3000/](http://localhost:3000/).

El API se puede visualizar en [http://localhost:3000/api](http://localhost:3000/api).

## Instalación de Thumbnail Creator

Una vez descargado el repositorio, se debe colocar dentro de la carpeta thumbnail-creator e instalar las dependencias:

```javascript
cd thumbnail-creator
npm install
```

Para correr thumbnail-creator en la consola:

```javascript
node app.js
```

Cada vez que se crea un anuncio y se sube una foto, el microservicio de `thumbnail-creator` creará un thumbnail de la imagen original y lo guardará en la carpeta `nodepop/public/images/anuncios/thumbnails`.

## API

El API contiene los siguientes endpoints:

- /api/authenticate
- /api/anuncios
- /api/tags

El API de anuncios y tags están protegidos y requieren autenticación.

## Autenticación

Para el uso de los endpoints protegidos, se debe hacer un request al API de autenticación:

```javascript
POST /api/authenticate

BODY (JSON):
{
    "email": "user@example.com",
    "password": "1234"
}

RESPONSE 200:
{
    "tokenJWT": "json-web-token-del-usuario-autenticado"
}
```

Una vez obtenido el token, se debe enviar en cada request en el header:

```javascript
KEY: Authorization
VALUE: json-web-token-del-usuario-autenticado
```

## API de Anuncios

### Lista de anuncios

- **Método:** GET
- **URL:** /api/anuncios
- **Autenticación:** Requiere autenticación

```javascript
URL PARAMS:

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

**Respuestas:**

```javascript
RESPONSE 200:
{
    "results": [
        {
            "_id": "65dfb10bd7fff4beb45a6c61",
            "nombre": "Bicicleta",
            "venta": true,
            "precio": 230.15,
            "foto": "bicicleta.jpg",
            "tags": [
                "lifestyle",
                "motor"
            ],
            "owner": "665a0292de9cc06bd3fc8ce6"
        }
    ]
}
```

### Anuncio individual

- **Método:** GET
- **URL:** /api/anuncios/:id
- **Autenticación:** Requiere autenticación

```javascript
RESPONSE 200:
{
    "result": {
        "_id": "65dfb10bd7fff4beb45a6c62",
        "nombre": "iPhone 11",
        "venta": false,
        "precio": 50,
        "foto": "iphone11.jpg",
        "tags": [
            "lifestyle",
            "mobile"
        ],
        "owner": "665a0292de9cc06bd3fc8ce6"
    }
}
```

### Crear un anuncio

- **Método:** POST
- **URL:** /api/anuncios
- **Autenticación:** Requiere autenticación

```javascript
BODY (form-data):

KEY         TYPE        EXAMPLE
nombre      text        Nuevo producto
venta       text        true
precio      text        12.56
tags        text        mobile
tags        text        motor
foto        file        mi-imagen.jpg
```

**Respuestas:**

```javascript
RESPONSE 200:
{
    "result": {
        "nombre": "Nuevo producto",
        "venta": true,
        "precio": 12.56,
        "foto": "foto-1717175501408-mi-imagen.jpg",
        "tags": [
            "mobile",
            "motor"
        ],
        "_id": "65e0dcd766a37c42703a6627",
        "owner": "665a0292de9cc06bd3fc8ce6"
    }
}
```

### Actualizar un anuncio

- **Método:** PUT
- **URL:** /api/anuncios/:id
- **Autenticación:** Requiere autenticación

```javascript
BODY (JSON):
{
    "nombre": "Nuevo nombre",
    "venta": true,
    "precio": 105.11,
    "tags": [
        "mobile"
    ]
}
```

**Respuestas:**

```javascript
RESPONSE 200:
{
    "result": {
        "_id": "65e0dcd766a37c42703a6627",
        "nombre": "Nuevo nombre",
        "venta": true,
        "precio": 105.11,
        "tags": [
            "mobile"
        ]
    }
}
```

### Eliminar un anuncio

- **Método:** DELETE
- **URL:** /api/anuncios/:id
- **Autenticación:** Requiere autenticación

```javascript
RESPONSE 200:
No devuelve ningún elemento, solo el status 200.
```

## API de Tags

### Lista de tags

- **Método:** GET
- **URL:** /api/tags
- **Autenticación:** Requiere autenticación

```javascript
RESPONSE 200:
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
