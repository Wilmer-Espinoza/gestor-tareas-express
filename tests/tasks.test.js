const request = require('supertest');
const { createApp } = require('../src/app');

describe('API de tareas', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  test('obtiene el listado de tareas', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('crea una tarea correctamente', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Estudiar Jest', description: 'Completar la práctica' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      title: 'Estudiar Jest',
      description: 'Completar la práctica',
      status: 'Pendiente'
    });
  });

  test('impide crear una tarea sin título', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: '   ', description: 'No debe guardarse' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El título es obligatorio.');

    const listResponse = await request(app).get('/api/tasks');
    expect(listResponse.body).toHaveLength(0);
  });

  test('edita una tarea', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ title: 'Título original', description: 'Descripción original' });

    const response = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({
        title: 'Título actualizado',
        description: 'Descripción actualizada',
        status: 'Completada'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      title: 'Título actualizado',
      description: 'Descripción actualizada',
      status: 'Completada'
    });
  });

  test('elimina una tarea', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tarea que se eliminará' });

    const response = await request(app).delete(`/api/tasks/${created.body.id}`);

    expect(response.status).toBe(204);

    const listResponse = await request(app).get('/api/tasks');
    expect(listResponse.body).toEqual([]);
  });

  test('marca una tarea como completada', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ title: 'Completar esta tarea' });

    const response = await request(app)
      .patch(`/api/tasks/${created.body.id}/status`)
      .send({ status: 'Completada' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Completada');
  });

  test('responde 404 cuando la tarea no existe', async () => {
    const response = await request(app)
      .put('/api/tasks/999')
      .send({ title: 'No existe', description: '', status: 'Pendiente' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Tarea no encontrada.');
  });
});
