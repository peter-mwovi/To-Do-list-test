import updateTaskStatus from './completed.js';

import updateTaskText from './adddelupd.js';

// Mock localStorage
let localStorageMock = {};
global.localStorage = {
  getItem: (key) => localStorageMock[key],
  setItem: (key, value) => {
    (localStorageMock[key] = value);
  },
};

// Mock the DOM manipulation
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const setupDOM = () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body><ul id="task-list"></ul></body></html>');
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

  test('should update the description of a task and DOM', () => {
    // Arrange
    const tasks = [
      { index: 1, name: 'Task 1', completed: false },
      { index: 2, name: 'Task 2', completed: false },
      { index: 3, name: 'Task 3', completed: false },
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
    expect(taskElement.querySelector('.task-name').textContent).toBe(newDescription);
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

  test('should update the task status and DOM when the checkbox is checked', () => {
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
    const taskNameElement = taskElement.querySelector('.task-name');
    expect(taskNameElement.classList.contains('completed')).toBe(true);
  });

  test('should update the task status and DOM when the checkbox is unchecked', () => {
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
    const taskNameElement = taskElement.querySelector('.task-name');
    expect(taskNameElement.classList.contains('completed')).toBe(false);
  });

  // test('should not update the task when the taskIndex is invalid', () => {
  //   // Arrange
  //   const tasks = [
  //     { index: 1, name: 'Task 1', completed: false },
  //     { index: 2, name: 'Task 2', completed: false },
  //     { index: 3, name: 'Task 3', completed: false },
  //   ];
  //   const taskIndexToUpdate = 5;
  //   const checkboxChecked = true;

  //   // Act
  //   const updatedTasks = updateTaskStatus(checkboxChecked, taskIndexToUpdate, tasks);

  //   // Assert
  //   expect(updatedTasks).toEqual(tasks);

  //   // Check if DOM is not updated
  //   const taskList = document.getElementById('task-list');
  //   expect(taskList.children).toHaveLength(tasks.length);
  // });
});
