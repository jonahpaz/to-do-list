import { getDateStringInputFormat } from "./strings.mjs";
import { Task } from "./task.mjs";

class Category {
    constructor(data) {
        this.name = data.name;
        this.iconCode = data.iconCode;
        this.type = data.type;
        this.tasks = new Set();
        this.id = this.type === 'default' ? this.name : crypto.randomUUID();
        this.unselectable = false;
        Category.addToLists(this);
        if (this.type === 'custom') Category.updateStorage();
    }
    static list = new Map();
    static default = new Map();
    static custom = new Map();
    static defaultData = [];
    static customData = [];

    static updateData() {
        this.defaultData.length = 0;
        for (const category of this.default.values()) {
            this.defaultData.push({name: category.name, tasks: [...category.tasks]})
        }
        this.customData.length = 0;
        for (const category of this.custom.values()) {
            this.customData.push({category: category, tasks: [...category.tasks]});
        }
    }
    static updateStorage() {
        this.updateData();
        localStorage.setItem('defaultCategoriesData', JSON.stringify(this.defaultData));
        localStorage.setItem('customCategoriesData', JSON.stringify(this.customData));
    }
    static addToLists(category) {
        this.list.set(category.id, category);

        if (category.type === 'default') {
            this.default.set(category.name, category);

        } else if (category.type === 'custom') {
            this.custom.set(category.id, category);
        }
    }
    static removeCustomFromLists(category) {
        this.list.delete(category.id);
        this.custom.delete(category.id);
    }

    static update(task) {
        Category.removeTask(task);

        if (task.completed) {
            Category.addTask('default', 'Completed', task.id);

        } else {
            if (task.date) {
                Category.addTask('default', 'Scheduled', task.id);

                const todayString = getDateStringInputFormat(new Date());
                if (task.date === todayString) {
                    Category.addTask('default', 'Today', task.id);
                }
    
            } else {
                Category.addTask('default', 'No alert', task.id);
            }

            if (task.categoryId) {
                Category.addTask('list', task.categoryId, task.id);
            }
        }

        Category.orderTasks();
        this.updateStorage();
    }
    static addTask(list, identifier, taskId) {
        const category = Category[list].get(identifier);
        category.tasks.add(taskId);
    }
    static removeTask(task) {
        for (const category of Category.list.values()) {
            let taskIsHere = category.tasks.has(task.id);
            if (taskIsHere) {
                category.tasks.delete(task.id);
            }
        }        
    }
    static orderTasks() {
        for (const category of Category.list.values()) {
            let tasksArray = Array.from(category.tasks);
            tasksArray.forEach(taskId => taskId = Task.list.get(taskId));
            let tasksWithDateArray = tasksArray.filter(task => {
                return task.date;
            });
            let tasksWithoutDateArray = tasksArray.filter(task => {
                return !task.date;
            });
            tasksWithDateArray.sort((a, b) => a.getDateTimeObj() - b.getDateTimeObj());

            let orderedTasksArray = [...tasksWithDateArray, ...tasksWithoutDateArray];
            orderedTasksArray.forEach(task => task = task.id);
            let newTasks = new Set(orderedTasksArray);
            
            category.tasks = newTasks;
        }
    }
    static getStrippedCategories(type) {
        const strippedCategories = [];
        for (const category of Category[type].values()) {
            let strippedCategory = {name: category.name, tasks: []};

            for (const taskId of category.tasks) {
                const task = Task.list.get(taskId);
                let strippedTask = task.getStrippedTask();
                strippedCategory.tasks.push(strippedTask);
            }
            strippedCategories.push(strippedCategory);
        }
        return strippedCategories;
    }
}

function createDefaultCategories() {
    const today = new Category({
        name: 'Today', 
        iconCode: 128197, 
        type: 'default'
    });

    const scheduled = new Category({
        name: 'Scheduled', 
        iconCode: 8986, 
        type: 'default'
    });
    const noAlert = new Category({
        name: 'No alert', 
        iconCode: 128220, 
        type: 'default'
    });
    const completed = new Category({
        name: 'Completed', 
        iconCode: 10004, 
        type: 'default'
    });
    today.unselectable = true;
    scheduled.unselectable = true;
    noAlert.unselectable = true;
    completed.unselectable = true;
    new Category({
        name: 'Important', 
        iconCode: 127775, 
        type: 'default'
    });
    new Category({
        name: 'Someday', 
        iconCode: 127776, 
        type: 'default'
    });
}
createDefaultCategories();


export { Category }