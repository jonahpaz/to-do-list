import { getDateStringInputFormat } from "./strings.mjs";
import { Task } from "./task.mjs";

class Category {
    constructor(name, iconCode, type) {
        this.name = name;
        this.iconCode = iconCode;
        this.type = type;
        this.tasks = new Map();
        this.id = crypto.randomUUID();
        this.unselectable = false;
        this.addToLists();
    }
    addToLists() {
        Category.lists.all.set(this.id, this);

        const identifier = this.type === 'default' ? this.name : this.id;
        Category.lists[this.type].set(identifier, this);
    }
    static lists = {
        all: new Map(),
        default: new Map(),
        custom: new Map(),
    }
    static add(list, identifier, task) {
        const category = Category.lists[list].get(identifier);
        category.tasks.set(task.id, task);
    }
    static remove(task) {
        for (const category of Category.lists.all.values()) {
            let taskIsHere = category.tasks.get(task.id);
            if (taskIsHere) category.tasks.delete(task.id);
        }
    }
    static update(task) {
        Category.remove(task);

        if (task.completed) {
            Category.add('default', 'Completed', task);
            return;
        }
        if (task.date) {
            Category.add('default', 'Scheduled', task);
            
            const todayString = getDateStringInputFormat(new Date());
            if (task.date === todayString) 
            Category.add('default', 'Today', task);

        } else 
            Category.add('default', 'No alert', task);

        if (task.categoryId) 
            Category.add('all', task.categoryId, task);

        Category.orderTasks();
    }
    static orderTasks() {
        for (const category of Category.lists.all.values()) {
            let tasksArray = Array.from(category.tasks.values());
            let tasksWithDateArray = tasksArray.filter(task => task.date);
            let tasksWithoutDateArray = tasksArray.filter(task => !task.date);
            tasksWithDateArray.sort((a, b) => a.dateTimeObj - b.dateTimeObj);

            let orderedTasksArray = [...tasksWithDateArray, ...tasksWithoutDateArray];
            let newTasks = new Map();
            for (const task of orderedTasksArray) {
                newTasks.set(task.id, task);
            }
            category.tasks = newTasks;
        }
    }
    static getStrippedCategories(type) {
        const strippedCategories = [];
        for (const category of Category.lists[type].values()) {
            let strippedCategory = {name: category.name, tasks: []};

            for (const task of category.tasks.values()) {
                let strippedTask = Task.getStrippedTask(task);
                strippedCategory.tasks.push(strippedTask);
            }
            strippedCategories.push(strippedCategory);
        }
        return strippedCategories;
    }
}

function createDefaultCategories() {
    const today = new Category('Today', 128197, 'default');
    const scheduled = new Category('Scheduled', 8986, 'default');
    const noAlert = new Category('No alert', 128220, 'default');
    const completed = new Category('Completed', 10004, 'default');
    today.unselectable = true;
    scheduled.unselectable = true;
    noAlert.unselectable = true;
    completed.unselectable = true;
    new Category('Important', 127775, 'default');
    new Category('Someday', 127776, 'default');
}
createDefaultCategories();



const iconFielset = document.createElement('fieldset');
const firstFieldsetOfCategoryDialog = document.querySelector('#category-dialog div :first-child');
firstFieldsetOfCategoryDialog.after(iconFielset);
iconFielset.id = 'icons';

const iconCodes = [127809, 127928, 127937, 127968, 128021, 128276, 128293, 
    128296, 128640, 128663, 128694, 129505];
for (let i = 0; i < iconCodes.length; i++) {
    let label = document.createElement('label');
    label.innerHTML = `&#${iconCodes[i]};`
    let input = document.createElement('input');
    label.appendChild(input);
    input.type = 'radio'; 
    input.name = 'icon';
    input.value = iconCodes[i];
    input.classList.add('circle');
    iconFielset.appendChild(label);
}
iconFielset.firstElementChild.children[0].checked = true;



export { Category }