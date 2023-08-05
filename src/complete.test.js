import { updateTaskStatus, updateTaskText, deleteCompletedTasks } from './completed.js';

// Mock localStorage
let localStorageMock = {};

global.localStorage = {
  getItem: (key) => localStorageMock[key],
  setItem: (key, value) => { (localStorageMock[key] = value); },
};

// Mock the DOM manipulation
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const setupDOM = () => {
  const dom = new JSDOM(
    '<!DOCTYPE html><html><body><ul id="task-list">'
      + '<li><span class="task-index"></span><input type="checkbox" class="checkbox" checked><span class="task-text">Task 1</span></li>'
      + '<li><span class="task-index"></span><input type="checkbox" class="checkbox"><span class="task-text">Task 2</span></li>'
      + '<li><span class="task-index"></span><input type="checkbox" class="checkbox" checked><span class="task-text">Task 3</span></li>'
      + '</ul></body></html>',
  );
  global.window = dom.window;
  global.document = dom.window.document;
};

const cleanupDOM = () => {
  global.window = undefined;
  global.document = undefined;
};

describe('updateTaskText', () => {
  beforeEach(() => {
    // Reset the mock localStorage before each test
    localStorageMock = {};
    setupDOM();
  });

  afterEach(() => {
    cleanupDOM();
  });

  test('Should update the description of a task in localSorage and the DOM', () => {
    // Arrange
    const tasks = [
      { index: 1, name: 'Task 1', completed: true },
      { index: 2, name: 'Task 2', completed: false },
      { index: 3, name: 'Task 3', completed: true },
    ];
    const indexToUpdate = 2;
    const newDescription = 'Updated Task2';

    // Act
    updateTaskText(newDescription, indexToUpdate, tasks);

    // Assert
    const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
    expect(updatedTasks).toHaveLength(tasks.length);
    expect(updatedTasks[indexToUpdate - 1].name).toBe(newDescription);

    // Check if DOM is updated correctly
    const taskList = document.getElementById('task-list');
    const taskElement = taskList.children[indexToUpdate - 1];
    expect(taskElement.querySelector('.task-text').textContent).toBe(newDescription);
  });
});

describe('updateTaskStatus', () => {
  beforeEach(() => {
    // Reset the mock localStorage and DOM before each test
    localStorageMock = {};
    setupDOM();
  });

  afterEach(() => {
    cleanupDOM();
  });

  test('Should update the task status and the DOM when the checkbox is checked', () => {
    // Arrange
    const tasks = [
      { index: 1, name: 'Task 1', completed: false },
      { index: 2, name: 'Task 2', completed: false },
      { index: 3, name: 'Task 3', completed: false },
    ];
    const taskIndexToUpdate = 2;
    const checkboxChecked = true;

    // Act
    const updatedTasks = updateTaskStatus(checkboxChecked, taskIndexToUpdate, tasks);

    // Assert
    expect(updatedTasks[taskIndexToUpdate - 1].completed).toBe(true);

    // Check if DOM is updated correctly
    const taskList = document.getElementById('task-list');
    const taskElement = taskList.children[taskIndexToUpdate - 1];
    const taskNameElement = taskElement.querySelector('.checkbox');
    expect(taskNameElement.classList.contains('completed')).toBe(true);
  });

  test('Should update the task status and the DOM when the checkbox is unchecked', () => {
    // Arrange
    const tasks = [
      { index: 1, name: 'Task 1', completed: true },
      { index: 2, name: 'Task 2', completed: true },
      { index: 3, name: 'Task 3', completed: true },
    ];
    const taskIndexToUpdate = 2;
    const checkboxChecked = false;

    // Act
    const updatedTasks = updateTaskStatus(checkboxChecked, taskIndexToUpdate, tasks);

    // Assert
    expect(updatedTasks[taskIndexToUpdate - 1].completed).toBe(false);

    // Check if DOM is updated correctly
    const taskList = document.getElementById('task-list');
    const taskElement = taskList.children[taskIndexToUpdate - 1];
    const taskNameElement = taskElement.querySelector('.checkbox');
    expect(taskNameElement.classList.contains('completed')).toBe(false);
  });
});

describe('deleteCompletedTasks', () => {
  beforeEach(() => {
    // Reset the mock localStorage and DOM before each test
    localStorageMock = {};
    setupDOM();
  });

  afterEach(() => {
    cleanupDOM();
  });

  test('Should delete completed tasks and reindex the remaining tasks', () => {
    // Arrange
    const tasks = [
      { index: 1, name: 'Task 1', completed: true },
      { index: 2, name: 'Task 2', completed: false },
      { index: 3, name: 'Task 3', completed: true },
    ];

    // Act
    const updatedTasks = deleteCompletedTasks(tasks);

    // Assert
    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].name).toBe('Task 2');
    expect(updatedTasks[0].completed).toBe(false);

    // Check if DOM is updated correctly
    const taskList = document.getElementById('task-list');
    expect(taskList.children).toHaveLength(1);
    const remainingTaskElement = taskList.children[0];
    const remainingTaskName = remainingTaskElement.querySelector('.task-text').textContent;
    expect(remainingTaskName).toBe('Task 2');
    const remainingTaskCheckbox = remainingTaskElement.querySelector('.checkbox');
    expect(remainingTaskCheckbox.checked).toBe(false);

    // Check if the localStorage is updated correctly
    const updatedTasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
    expect(updatedTasksFromLocalStorage).toHaveLength(1);
    expect(updatedTasksFromLocalStorage[0].name).toBe('Task 2');
    expect(updatedTasksFromLocalStorage[0].completed).toBe(false);
    expect(updatedTasksFromLocalStorage[0].index).toBe(1);
  });
});