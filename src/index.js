import "./styles.css";
import { Task } from "./modules/task.mjs";
import { Category } from "./modules/categories.mjs"
import { time } from "./modules/time.mjs";
import { snapElementsInClockBasedOnTimeObject } from "./modules/clock.mjs";
import { getTaskHTML } from "./modules/taskDom.mjs";
import { addNewSubtask } from "./modules/subTaskDom.mjs";
import { 
    taskElementsStorage,
    createCategoryHTML, 
    updateTaskCount, 
} from "./modules/categoriesDom.mjs";
import { 
    dateDom,
    timeDom, 
    scheduleDiv,
    setDefaultDateForInput, 
    setDefaultTimeForInput,
    resetDateAndTime,
} from "./modules/dateTimeDom.mjs";


const dialogFooter = document.querySelector('dialog.footer');
const buttonFooter = document.querySelector('button.footer');

const newSubtaskButton = document.querySelector('#new-subtask');
const taskDiv = document.querySelector('#task');///lo usa addNewSubtask y no se quien mas
const newTaskForm = document.querySelector('#new-task');
const newTaskButton = document.querySelector('#text-area .done');

const dateAndTimeContext = document.querySelector('#date-and-time-context');
const setDateAndTimeButton = document.querySelector('#set-date-and-time');
const categoriesContext = document.querySelector('#categories-context');
const setCategoryButton = document.querySelector('#set-category');

buttonFooter.addEventListener('click', () => {
    dialogFooter.showModal();
});

newSubtaskButton.addEventListener('click', addNewSubtask.bind(null, taskDiv));

newTaskButton.addEventListener('click', (event) => {
    event.preventDefault();
    const textAreas = [...taskDiv.querySelectorAll('textarea')];
    if (!textAreas.every(tA => tA.value)) return;

    const data = getTaskFormData();
    const newTask = new Task(data);

    let taskElement = getTaskHTML(newTask);
    taskElementsStorage.set(newTask.id, taskElement);

    Category.update(newTask);
    updateTaskCount();

    updateConsole(newTask);
    resetForm();
    dialogFooter.close();
});
function getTaskFormData() {
    const categoryRadio = document.querySelector('input[name="category"]:checked');
    let data = {};
    data.date = dateDom.input.dataset.default ? undefined : dateDom.input.value;
    data.time = timeDom.input.dataset.default ? undefined : timeDom.input.value;
    data.categoryId = categoryRadio.value === 'none' ? undefined : categoryRadio.dataset.id;
    data.content = getContent(taskDiv);
    return data;
}
function getContent(taskDiv) {
    const taskBody = [];
    for (let childEl of taskDiv.children) {
        let obj = {};

        if        (childEl.dataset.type === 'main-task') {
            obj.type = 'mainTask';

        } else if (childEl.dataset.type === 'sub-task') {
            obj.type = 'subTask';
            childEl = childEl.lastElementChild;
        }

        obj.text = childEl.value;
        taskBody.push(obj);
    }
    return taskBody;
}
function updateConsole(task) {
    console.log(task);

    const everyTask = Task.getStrippedTasks();
    console.log('Every Task:', everyTask);

    const defaultCategories = Category.getStrippedCategories('default');
    console.log('Default Categories:', defaultCategories);

    const customCategories = Category.getStrippedCategories('custom');
    console.log('Custom Categories', customCategories);
}
function resetForm() {
    taskDiv.innerHTML = '';/////////////
    const textareaReplacement = document.createElement('textarea');
    taskDiv.appendChild(textareaReplacement);
    textareaReplacement.dataset.type = 'main-task';
    textareaReplacement.classList.add('main-task');
    textareaReplacement.placeholder = 'Add reminder';
    textareaReplacement.focus();
    
    scheduleDiv.innerHTML = '';//////////////
    newTaskForm.reset();
    resetDateAndTime();/////////////////
}

setDateAndTimeButton.addEventListener('click', getDateAndTimeContext);
function getDateAndTimeContext() {
    dateAndTimeContext.classList.add('visible');
    categoriesContext.classList.remove('visible');
}
setCategoryButton.addEventListener('click', getCategoriesContext);
function getCategoriesContext() {
    categoriesContext.classList.add('visible');
    dateAndTimeContext.classList.remove('visible');
}

function setContentFromLocalStorage() {
    const savedDefaultString = localStorage.getItem('defaultCategoriesData');
    const defaultCategoriesData = JSON.parse(savedDefaultString);
    if (savedDefaultString && defaultCategoriesData.length > 0) {
        defaultCategoriesData.forEach(data => {
            const category = Category.default.get(data.name);
            category.tasks = new Set(data.tasks);
        });
    }
    const savedCustomString = localStorage.getItem('customCategoriesData');
    const customCategoriesData = JSON.parse(savedCustomString);
    if (savedCustomString && customCategoriesData.length > 0) {
        customCategoriesData.forEach(data => {
            data.category.tasks = new Set(data.tasks);
            Object.setPrototypeOf(data.category, Category.prototype);
            Category.addToLists(data.category);
            createCategoryHTML(data.category);
        });
    }
    const tasksDataString = localStorage.getItem('tasksData');
    let tasksData;
    if (tasksDataString) tasksData = JSON.parse(tasksDataString);
    if (tasksData) {
        tasksData.forEach(task => {
            Object.setPrototypeOf(task, Task.prototype);
            Task.list.set(task.id, task);
            let taskElement = getTaskHTML(task);
            taskElementsStorage.set(task.id, taskElement);
        });
    }
    updateTaskCount();
}

navigator.virtualKeyboard.overlaysContent = true;
setDefaultDateForInput();
setDefaultTimeForInput();
time.update(timeDom.input.value);
snapElementsInClockBasedOnTimeObject(timeDom.dialog);
setContentFromLocalStorage();