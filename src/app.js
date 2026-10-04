const path = require('path');
const express = require('express');
const { createTaskStore } = require('./taskStore');

const VALID_STATUSES = ['Pendiente', 'Completada'];

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function createApp(store = createTaskStore()) {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/tasks', (req, res) => {
    res.json(store.getAll());
  });

  app.post('/api/tasks', (req, res) => {
    const title = normalizeText(req.body.title);
    const description = normalizeText(req.body.description);
    const status = req.body.status || 'Pendiente';

    if (!title) {
      return res.status(400).json({ error: 'El título de la tarea es obligatorio.' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'El estado no es válido.' });
    }

    const task = store.create({ title, description, status });
    return res.status(201).json(task);
  });

  app.put('/api/tasks/:id', (req, res) => {
    const id = parseId(req.params.id);
    const title = normalizeText(req.body.title);
    const description = normalizeText(req.body.description);
    const status = req.body.status;

    if (!id) {
      return res.status(400).json({ error: 'El identificador no es válido.' });
    }

    if (!title) {
      return res.status(400).json({ error: 'El título de la tarea es obligatorio.' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'El estado no es válido.' });
    }

    const task = store.update(id, { title, description, status });

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    return res.json(task);
  });

  app.patch('/api/tasks/:id/status', (req, res) => {
    const id = parseId(req.params.id);
    const status = req.body.status;

    if (!id) {
      return res.status(400).json({ error: 'El identificador no es válido.' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'El estado no es válido.' });
    }

    const task = store.update(id, { status });

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    return res.json(task);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: 'El identificador no es válido.' });
    }

    if (!store.remove(id)) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    return res.status(204).send();
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada.' });
  });

  return app;
}

module.exports = { createApp };
