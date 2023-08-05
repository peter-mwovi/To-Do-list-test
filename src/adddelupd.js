import { arrangeIndexes } from './completed.js';

function createTaskElement(taskName, tasksLocal) {
  const index = tasksLocal.length + 1;
  const complete = false;
  const taskString = { index, name: taskName, completed: complete };
  tasksLocal.push(taskString);
  localStorage.setItem('tasks', JSON.stringify(tasksLocal));
}

function deleteTaskElement(tasksLocal, delBtn) {
  const parent = delBtn.parentNode;
  const taskIndex = parent.getElementsByClassName('task-index')[0].value;
  tasksLocal = tasksLocal.filter((tr) => tr.index !== taskIndex);
  arrangeIndexes(tasksLocal);
  localStorage.setItem('tasks', JSON.stringify(tasksLocal));
  return tasksLocal;
}

export { createTaskElement, deleteTaskElement };
