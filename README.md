# Gestor de Tareas - CRUD

Aplicación web sencilla para crear, consultar, editar, completar y eliminar tareas. Fue desarrollada como proyecto de práctica para Gestión de la Configuración de Software, Git, GitHub e Integración Continua.

Los datos se almacenan temporalmente en memoria, por lo que se reinician cada vez que se detiene el servidor.

## Tecnologías utilizadas

- Node.js
- Express
- HTML5
- CSS3
- JavaScript
- Jest
- Supertest

## Requisitos

- Node.js 18 o una versión posterior
- npm

## Instalación

Clona o descarga el proyecto, entra en su carpeta e instala las dependencias:

```bash
npm install
```

## Ejecutar la aplicación

Inicia el servidor con:

```bash
npm start
```

Luego abre en el navegador:

```text
http://localhost:3000
```

Para usar otro puerto, define la variable de entorno `PORT` antes de iniciar el servidor.

## Ejecutar las pruebas

Ejecuta todas las pruebas automatizadas con:

```bash
npm test
```

Las pruebas verifican el listado, la creación, la validación del título, la edición, el cambio de estado y la eliminación de tareas.

## Rutas de la API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/tasks` | Obtiene todas las tareas |
| `POST` | `/api/tasks` | Crea una tarea |
| `PUT` | `/api/tasks/:id` | Edita una tarea |
| `PATCH` | `/api/tasks/:id/status` | Cambia el estado de una tarea |
| `DELETE` | `/api/tasks/:id` | Elimina una tarea |

## Estructura del proyecto

```text
gestor-de-tareas-crud/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   ├── app.js
│   ├── server.js
│   └── taskStore.js
├── tests/
│   └── tasks.test.js
├── .gitignore
├── package.json
└── README.md
```

## Notas

- El título es obligatorio y no se aceptan valores formados solo por espacios.
- Los estados permitidos son `Pendiente` y `Completada`.
- Este proyecto no incluye todavía GitHub Actions, `CHANGELOG.md` ni releases.
