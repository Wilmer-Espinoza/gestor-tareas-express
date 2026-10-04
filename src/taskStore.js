function createTaskStore() {
  let tasks = [];
  let nextId = 1;

  return {
    getAll() {
      return tasks;
    },

    getById(id) {
      return tasks.find((task) => task.id === id);
    },

    create({ title, description = '', status = 'Pendiente' }) {
      const task = {
        id: nextId,
        title,
        description,
        status
      };

      nextId += 1;
      tasks.push(task);
      return task;
    },

    update(id, changes) {
      const task = this.getById(id);

      if (!task) {
        return null;
      }

      Object.assign(task, changes);
      return task;
    },

    remove(id) {
      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        return false;
      }

      tasks.splice(index, 1);
      return true;
    }
  };
}

module.exports = { createTaskStore };
