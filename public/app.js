const API_URL = '/api/tasks';

const form = document.querySelector('#task-form');
const taskIdInput = document.querySelector('#task-id');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const formTitle = document.querySelector('#form-title');
const formError = document.querySelector('#form-error');
const submitButton = document.querySelector('#submit-button');
const cancelEditButton = document.querySelector('#cancel-edit');
const taskList = document.querySelector('#task-list');
const taskTemplate = document.querySelector('#task-template');
const emptyState = document.querySelector('#empty-state');
const pendingCount = document.querySelector('#pending-count');
const taskFilter = document.querySelector('#task-filter');

let tasks = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'No se pudo completar la operación.');
  }

  return response.status === 204 ? null : response.json();
}

async function loadTasks() {
  try {
    tasks = await request(API_URL);
    renderTasks();
  } catch (error) {
    taskList.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}

function renderTasks() {
  const selectedFilter = taskFilter.value;
  const visibleTasks = selectedFilter === 'Todas'
    ? tasks
    : tasks.filter((task) => task.status === selectedFilter);

  taskList.replaceChildren();
  emptyState.classList.toggle('hidden', visibleTasks.length > 0);
  pendingCount.textContent = tasks.filter((task) => task.status === 'Pendiente').length;

  visibleTasks.forEach((task) => {
    const fragment = taskTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.task-card');
    const heading = fragment.querySelector('h3');
    const description = fragment.querySelector('.task-description');
    const badge = fragment.querySelector('.status-badge');

    card.dataset.id = task.id;
    card.classList.toggle('completed', task.status === 'Completada');
    heading.textContent = task.title;
    description.textContent = task.description || 'Sin descripción';
    badge.textContent = task.status;
    fragment.querySelector('.status-toggle').title = task.status === 'Completada'
      ? 'Marcar como pendiente'
      : 'Marcar como completada';

    taskList.append(fragment);
  });
}

function resetForm() {
  form.reset();
  taskIdInput.value = '';
  formTitle.textContent = 'Nueva tarea';
  submitButton.textContent = 'Agregar tarea';
  cancelEditButton.classList.add('hidden');
  formError.textContent = '';
}

function beginEdit(task) {
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  formTitle.textContent = 'Editar tarea';
  submitButton.textContent = 'Guardar cambios';
  cancelEditButton.classList.remove('hidden');
  formError.textContent = '';
  titleInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const editingId = Number(taskIdInput.value);

  if (!title) {
    formError.textContent = 'El título de la tarea es obligatorio.';
    titleInput.focus();
    return;
  }

  try {
    if (editingId) {
      const currentTask = tasks.find((task) => task.id === editingId);
      await request(`${API_URL}/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, status: currentTask.status })
      });
    } else {
      await request(API_URL, {
        method: 'POST',
        body: JSON.stringify({ title, description })
      });
    }

    resetForm();
    await loadTasks();
  } catch (error) {
    formError.textContent = error.message;
  }
});

taskList.addEventListener('click', async (event) => {
  const card = event.target.closest('.task-card');

  if (!card) {
    return;
  }

  const id = Number(card.dataset.id);
  const task = tasks.find((item) => item.id === id);

  if (event.target.closest('.edit-button')) {
    beginEdit(task);
    return;
  }

  try {
    if (event.target.closest('.delete-button')) {
      await request(`${API_URL}/${id}`, { method: 'DELETE' });
      if (Number(taskIdInput.value) === id) {
        resetForm();
      }
    } else if (event.target.closest('.status-toggle')) {
      const status = task.status === 'Pendiente' ? 'Completada' : 'Pendiente';
      await request(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } else {
      return;
    }

    await loadTasks();
  } catch (error) {
    window.alert(error.message);
  }
});

cancelEditButton.addEventListener('click', resetForm);
taskFilter.addEventListener('change', renderTasks);

loadTasks();
