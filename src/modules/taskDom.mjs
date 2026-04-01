import { Task } from "./task.mjs";
import { Category } from "./categories.mjs";
import { updateTaskCount } from "./categoriesDom.mjs";

//podrias aniadir funcionalidad de editar tasks con un boton y ahi si usando los eventlisteners de abajo comentados

function getTaskHTML(task) {
    const taskContainer = document.createElement('div');
    taskContainer.dataset.id = task.id;
    taskContainer.classList.add('task-container');
    taskContainer.addEventListener('click', buttonsHandlder);

    const completeCheckbox = document.createElement('input');
    taskContainer.appendChild(completeCheckbox);
    completeCheckbox.classList.add('complete', 'circle');
    completeCheckbox.type = 'checkbox';
    completeCheckbox.style.display = task.completed ? 'none': 'inline-block';

    const undoButton = document.createElement('button');
    taskContainer.appendChild(undoButton);
    undoButton.classList.add('undo', 'circle');
    undoButton.type = 'button';
    undoButton.innerHTML = '&#8630;';
    undoButton.style.display = task.completed ? 'inline-block': 'none';

    const deleteButton = document.createElement('button');
    taskContainer.appendChild(deleteButton);
    deleteButton.classList.add('delete', 'circle');
    deleteButton.type = 'button';
    deleteButton.innerHTML = '&#10060;';

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
        if (!task.schedule) {
            const schedule = `${dateDom.setButton.textContent}, ${timeDom.setButton.textContent}`;
            task.schedule = schedule;
            Task.updateStorage();
        }
        scheduleDiv.textContent = task.schedule;
    }

    return taskContainer;
}
function buttonsHandlder(event) {
    const button = event.target;
    const task = Task.list.get(this.dataset.id);

    if (button.classList.contains('complete')) completeTask(this, button, task);
    else 
    if (button.classList.contains('undo')) undoCompleteTask(this, button, task);
    else
    if (button.classList.contains('delete')) deleteTask(this, task);
}
function completeTask(taskElement, button, task) {
    const undoButton = document.querySelector('.undo');

    taskElement.classList.add('is-completing');
    setTimeout(() => {
        undoButton.style.display = 'inline-block';
        button.style.display = 'none';
        taskElement.remove();
        taskElement.classList.remove('is-completing');
    }, 500);
    
    task.completed = true;
    Task.updateStorage();
    Category.update(task);
    updateTaskCount();
}
function undoCompleteTask(taskElement, button, task) {
    const completeCheckbox = taskElement.querySelector('.complete');

    taskElement.classList.add('is-completing');
    setTimeout(() => {
        completeCheckbox.style.display = 'inline-block';
        completeCheckbox.checked = false;
        button.style.display = 'none';
        taskElement.remove();
        taskElement.classList.remove('is-completing');
        
        task.completed = false;
        Task.updateStorage();
        Category.update(task);
        updateTaskCount();
    }, 500);
}
function deleteTask(taskElement, task) {
    const userSaidYes = confirm('Are you sure you want to delete this permanently?');
    if (!userSaidYes) return;
    taskElement.classList.add('is-completing');
    setTimeout(() => {
        taskElement.removeEventListener('click', buttonsHandlder);
        taskElement.remove();
        taskElement.classList.remove('is-completing');
        
        Task.list.delete(task.id);
        Task.updateStorage();
        Category.removeTask(task);
        Category.updateStorage();
        updateTaskCount();
    }, 500);
}

export { getTaskHTML }