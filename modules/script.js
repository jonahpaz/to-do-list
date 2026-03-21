import { time, snapElementsInClockBasedOnTimeObject } from "./clock.mjs";
import { Task } from "./task.mjs";
import * as Strings from "./strings.mjs";
import { Category } from "./categories.mjs";
import { updateTaskCount } from "./categoriesDom.mjs";

const newSubtaskButton = document.querySelector('#new-subtask');
const taskDiv = document.querySelector('#task');
newSubtaskButton.addEventListener('click', addNewSubtask);



function addNewSubtask() {
    const containerLi = document.createElement('li');
    containerLi.dataset.type = 'sub-task';
    containerLi.classList.add('sub-task');

    const checkBox = document.createElement('input');
    containerLi.appendChild(checkBox);
    checkBox.type = 'checkbox';

    const subTask = document.createElement('textarea');
    containerLi.appendChild(subTask);
    
    containerLi.addEventListener('keydown', addNewSubtaskByPressingEnter);
    containerLi.addEventListener('keydown', gofromLiToTextArea);
    taskDiv.appendChild(containerLi); 
    containerLi.lastElementChild.focus();
    
    return containerLi;
}
function addNewSubtaskByPressingEnter(event) {
    const textarea = this.lastElementChild;
    if (textarea !== document.activeElement) return;
    if (event.key !== 'Enter') return;

    event.preventDefault();
    const restText = textarea.value.slice(textarea.selectionStart, textarea.value.length);
    let newItem = addNewSubtask();
    newItem.lastElementChild.value = restText;
}
function gofromLiToTextArea(event) {
    if (this.lastElementChild !== document.activeElement) return;
    if (event.key !== 'Backspace') return;
    if (this.lastElementChild.selectionStart !== 0) return;
    if (this.lastElementChild.selectionEnd !== 0) return;

    event.preventDefault();
    const previousText = this.lastElementChild.value;
    const newTextArea = document.createElement('textarea');
    newTextArea.dataset.type = 'main-task';
    newTextArea.classList.add('main-task');
    newTextArea.value += previousText;
    this.replaceWith(newTextArea);
    newTextArea.focus();

    newTextArea.addEventListener('keydown', removeTextArea);
}
function removeTextArea(event) {
    if (this !== document.activeElement) return;
    if (event.key !== 'Backspace') return;
    if (this.selectionStart !== 0) return;
    if (this.selectionEnd !== 0) return;
    
    event.preventDefault();
    const previousText = this.value;
    let previousTextArea;
    if (this.previousElementSibling.tagName === 'TEXTAREA')
        {previousTextArea = this.previousElementSibling}
    else {previousTextArea = this.previousElementSibling.lastElementChild}

    this.remove();
    previousTextArea.value += previousText;
    previousTextArea.focus();
}

function getTaskHTML(task) {
    const taskContainer = document.createElement('div');
    taskContainer.dataset.id = task.id;
    taskContainer.classList.add('task-container');
    Task.list.get(task.id).element = taskContainer;

    const completeCheckbox = document.createElement('input');
    taskContainer.appendChild(completeCheckbox);
    completeCheckbox.classList.add('complete', 'circle');
    completeCheckbox.type = 'checkbox';
    completeCheckbox.addEventListener('change', () => {
        completeTask(task, taskContainer, completeCheckbox, undoButton);
    });

    const undoButton = document.createElement('button');
    taskContainer.appendChild(undoButton);
    undoButton.classList.add('undo', 'circle');
    undoButton.type = 'button';
    undoButton.innerHTML = '&#8630;';
    undoButton.style.display = 'none';
    undoButton.addEventListener('click', () => {
        undoCompleteTask(task, taskContainer, completeCheckbox, undoButton);
    });

    const deleteButton = document.createElement('button');
    taskContainer.appendChild(deleteButton);
    deleteButton.classList.add('delete', 'circle');
    deleteButton.type = 'button';
    deleteButton.innerHTML = '&#10060;';
    deleteButton.addEventListener('click', () => {
        deleteTask(task, taskContainer);
    });

    const taskContent = document.createElement('div');
    taskContainer.appendChild(taskContent);
    taskContent.classList.add('task-content');

    for (const obj of task.content) {
        if (obj.type === 'mainTask') {
            const textarea = document.createElement('textarea');
            taskContent.appendChild(textarea);
            textarea.disabled = true;
            textarea.dataset.type = 'main-task';
            textarea.classList.add('main-task');
            textarea.textContent = obj.text;
        } else 
        if (obj.type === 'subTask') {
            const containerLi = document.createElement('li');
            taskContent.appendChild(containerLi);
            containerLi.dataset.type = 'sub-task';
            containerLi.classList.add('sub-task');
            // containerLi.addEventListener('keydown', addNewSubtaskByPressingEnter);
            // containerLi.addEventListener('keydown', gofromLiToTextArea);

            const checkBox = document.createElement('input');
            containerLi.appendChild(checkBox);
            checkBox.type = 'checkbox';

            const subTask = document.createElement('textarea');
            containerLi.appendChild(subTask);
            subTask.disabled = true;
            subTask.textContent = obj.text;
        }
    }

    if (task.date) {
        const scheduleDiv = document.createElement('div');
        taskContainer.appendChild(scheduleDiv);
        scheduleDiv.classList.add('schedule');
        scheduleDiv.textContent = 
            `${setDateButton.textContent}, ${setTimeButton.textContent}`;////////////
    }

    return taskContainer;
}
function completeTask(task, taskContainer, completeCheckbox, undoButton) {
    taskContainer.classList.add('is-completing');
    setTimeout(() => {
        taskContainer.remove();
        taskContainer.classList.remove('is-completing');
        completeCheckbox.style.display = 'none';
        undoButton.style.display = 'inline-block';
        
        task.completed = true;
        Category.update(task);
        updateTaskCount();
    }, 500);
}
function undoCompleteTask(task, taskContainer, completeCheckbox, undoButton) {
    taskContainer.classList.add('is-completing');
    setTimeout(() => {
        taskContainer.remove();
        taskContainer.classList.remove('is-completing');
        completeCheckbox.checked = false;
        completeCheckbox.style.display = 'inline-block';
        undoButton.style.display = 'none';
        
        task.completed = false;
        Category.update(task);
        updateTaskCount();
    }, 500);
}
function deleteTask(task, taskContainer) {
    const userSaidYes = confirm('Are you sure you want to delete this permanently?');
    if (!userSaidYes) return;
    taskContainer.classList.add('is-completing');
    setTimeout(() => {
        taskContainer.remove();
        taskContainer.classList.remove('is-completing');
        
        Task.list.delete(task.id);
        Category.remove(task);
        updateTaskCount();
    }, 500);
}


function getTaskFormData() {
    const categoryRadio = document.querySelector('input[name="category"]:checked');
    let data = {};
    data.date = dateInput.dataset.default ? undefined : dateInput.value;
    data.time = timeInput.dataset.default ? undefined : timeInput.value;
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

const newTaskForm = document.querySelector('#new-task');
const newTaskButton = document.querySelector('#text-area .done');
newTaskButton.addEventListener('click', (event) => {
    event.preventDefault();
    const textAreas = [...taskDiv.querySelectorAll('textarea')];
    if (!textAreas.every(tA => tA.value)) return;
    

    const data = getTaskFormData();
    const newTask = new Task(data);

    const newTaskHTML = getTaskHTML(newTask);
    Task.list.get(newTask.id).element = newTaskHTML;

    Category.update(newTask);
    updateTaskCount();

    updateConsole(newTask);
    resetForm();
});
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


const categoriesContext = document.querySelector('#categories-context');


const setDateAndTimeButton = document.querySelector('#set-date-and-time');
const dateAndTimeContext = document.querySelector('#date-and-time-context');
setDateAndTimeButton.addEventListener('click', getDateAndTimeContext);
function getDateAndTimeContext() {
    dateAndTimeContext.classList.toggle('visible');
    categoriesContext.classList.remove('visible');
}
function setDefaultDateForInput() {
    const defaulDate = Strings.getDefaultDateStringForInput();
    dateInput.value = defaulDate;
    dateInput.dataset.default = true;
}
function setDefaultTimeForInput() {
    const defaulTime = Strings.getDefaultTimeStringForInput();
    timeInput.value = defaulTime;
    timeInput.dataset.default = true;
}

const scheduleDiv = document.querySelector('#schedule');////////////////
const dateInput = document.querySelector('#date-dialog input');
const setDateButton = document.querySelector('#set-date');
setDateButton.addEventListener('click', () => dateDialog.showModal());
const dateDialog = document.querySelector('#date-dialog');
const cancelDateButton = document.querySelector('#date-dialog .cancel');
cancelDateButton.addEventListener('click', event => {
    event.preventDefault();
    dateDialog.close();
});
const doneDateButton = document.querySelector('#date-dialog .done');
doneDateButton.addEventListener('click', (event) => {
    event.preventDefault();
    delete dateInput.dataset.default;
    delete timeInput.dataset.default;
    if (dateInput.value) {
        if (!scheduleDiv.innerHTML) createDateTimeElements();
        setDateTimeSpansAndButtonsText();
    }
    dateDialog.close();
});
const timeInput = document.querySelector('#time-dialog input');
const setTimeButton = document.querySelector('#set-time');
setTimeButton.addEventListener('click', () => {
    timeDialog.showModal();
    document.activeElement?.blur();
});
const timeDialog = document.querySelector('#time-dialog');
const cancelTimeButton = document.querySelector('#time-dialog .cancel');
cancelTimeButton.addEventListener('click', event => {
    event.preventDefault();
    timeDialog.close();
});
const doneTimeButton = document.querySelector('#time-dialog .done');
doneTimeButton.addEventListener('click', (event) => {
    timeDialog.close();

    if (!timeInput.value) timeInput.value = time.getTimeForInput();
    const timeInputValue = Strings.getTimeInputValueMinutesMultipleOf5(timeInput.value);
    //This is done so if the user sets the time by tabing to the hidden index
    timeInput.value = timeInputValue;
    
    event.preventDefault();
    delete dateInput.dataset.default;
    delete timeInput.dataset.default;
    time.update(timeInput.value);
    snapElementsInClockBasedOnTimeObject(timeDialog);
    if (!scheduleDiv.innerHTML) createDateTimeElements();
    setDateTimeSpansAndButtonsText();
});
function getDateObjCorrectedDay(timeInputValue) {
    const dateTimeObj = new Date();
    const desiredHours = +timeInputValue.slice(0,2);
    const desiredMinutes = +timeInputValue.slice(3,5);
    const currentTimeInputValue = Strings.getTimeStringInputFormat(dateTimeObj);
    const currentHours = +currentTimeInputValue.slice(0,2);
    const currentMinutes = +currentTimeInputValue.slice(3,5);

    if ( currentHours > desiredHours || 
        (currentHours === desiredHours && currentMinutes > desiredMinutes )) {
        dateTimeObj.setDate(dateTimeObj.getDate() + 1);
    }
    return dateTimeObj;
}
function actionPresetButton(event, dateTimeObj, dateInputValue, timeInputValue) {
    
    if (!dateInputValue) {
        dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    }
    dateInput.value = dateInputValue;
    
    if (!timeInputValue) {
        timeInputValue = Strings.getTimeStringInputFormat(dateTimeObj);
        timeInputValue = Strings.getTimeInputValueMinutesMultipleOf5(timeInputValue);
    }
    timeInput.value = timeInputValue;
    
    event.preventDefault();
    delete dateInput.dataset.default;
    delete timeInput.dataset.default;
    time.update(timeInput.value);
    snapElementsInClockBasedOnTimeObject(timeDialog);
    if (!scheduleDiv.innerHTML) createDateTimeElements();
    setDateTimeSpansAndButtonsText();
}


function setDateTimeSpansAndButtonsText() {
    const timeString = Strings.getTimeStringForSpan(timeInput.value);
    setTimeButton.textContent = timeString;
    const timeSpan = document.querySelector('#time-span');
    timeSpan.textContent = timeString;
    
    const strings = Strings.getDateStringsForSpanAndButton(dateInput.value);
    setDateButton.textContent = strings.dateForButton;
    const dateSpan = document.querySelector('#date-span');
    dateSpan.textContent = strings.dateForSpan;
}
function createDateTimeElements() {
    const dateSpan = document.createElement('span');
    scheduleDiv.appendChild(dateSpan);
    dateSpan.id = 'date-span';
    
    scheduleDiv.innerHTML += ', ';

    const timeSpan = document.createElement('span');
    scheduleDiv.appendChild(timeSpan);
    timeSpan.id = 'time-span';
    
    const deleteButton = document.createElement('button');
    scheduleDiv.appendChild(deleteButton);
    deleteButton.id = 'delete-date-time';
    deleteButton.classList.add('circle');
    deleteButton.innerHTML = '&#10060;';
    deleteButton.addEventListener('click', resetDateAndTime);
}
/////////
function resetDateAndTime() {
    scheduleDiv.innerHTML = '';
    setDateButton.textContent = 'Set date';
    setTimeButton.textContent = 'Set time';
    setDefaultDateForInput(); setDefaultTimeForInput();
}

const oneHourFromNowButton = document.querySelector('#one-hour-from-now');
oneHourFromNowButton.addEventListener('click', (event) => {
    const now = new Date();    
    const oneHourFromNow = now.setHours(now.getHours() + 1);
    actionPresetButton(event, oneHourFromNow);
});
const sevenAMButton = document.querySelector('#seven-am');
sevenAMButton.addEventListener('click', (event) => {
    const timeInputValue = '07:00';
    const dateTimeObj = getDateObjCorrectedDay(timeInputValue);
    const dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    actionPresetButton(event, undefined, dateInputValue, timeInputValue);
});
const tenPMButton = document.querySelector('#ten-pm');
tenPMButton.addEventListener('click', (event) => {
    const timeInputValue = '22:00';
    const dateTimeObj = getDateObjCorrectedDay(timeInputValue);
    const dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    actionPresetButton(event, undefined, dateInputValue, timeInputValue);
});
const threePMButton = document.querySelector('#three-pm');
threePMButton.addEventListener('click', (event) => {
    const timeInputValue = '15:00';
    const dateTimeObj = getDateObjCorrectedDay(timeInputValue);
    const dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    actionPresetButton(event, undefined, dateInputValue, timeInputValue);
});





const setCategoryButton = document.querySelector('#set-category');
setCategoryButton.addEventListener('click', getCategoriesContext);
function getCategoriesContext() {
    categoriesContext.classList.toggle('visible');
    dateAndTimeContext.classList.remove('visible');
}




navigator.virtualKeyboard.overlaysContent = true;
setDefaultDateForInput();
setDefaultTimeForInput();
time.update(timeInput.value);
snapElementsInClockBasedOnTimeObject(timeDialog);