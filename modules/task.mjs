class Task {
    constructor(taskDiv, dateInput, timeInput, selectedCategory) {
        this.content = this.getContent(taskDiv);
        this.date = this.getDate(dateInput);
        this.time = this.getTime(timeInput);
        this.dateTimeObj = this.getDateTimeObj();
        this.categoryId = this.getCategoryId(selectedCategory);
        this.id = crypto.randomUUID();
        this.completed = false;
        Task.list.set(this.id, {object: this});
    }
    static list = new Map();
    getContent(taskDiv) {
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
    getDate(dateInput) {
        if (dateInput.dataset.default) return undefined;
        return dateInput.value;
    }
    getTime(timeInput) {
        if (timeInput.dataset.default) return undefined;
        return timeInput.value;
    }
    getDateTimeObj() {
        if (!this.date) return undefined;
        return new Date(`${this.date}T${this.time}`);
    }
    getCategoryId(selectedCategory) {
        if (selectedCategory.value === 'none') return undefined;
        return selectedCategory.dataset.id;
    }
    static getStrippedTasks() {
        const strippedTasks = [];
        for (const task of Task.list.values()) {
            let strippedTask = this.getStrippedTask(task.object);
            strippedTasks.push(strippedTask);
        }
        return strippedTasks;
    }
    static getStrippedTask(task) {
        const strippedTask = {};

        let schedule = task.date ? `${task.date}T${task.time}` : 'No alert';
        strippedTask.schedule = schedule;

        const strippedContent = [];
        for (const excerpt of task.content) {
            let strippedExcerpt = excerpt.type === 'mainTask' ? 
            excerpt.text : `- ${excerpt.text}`;

            strippedContent.push(strippedExcerpt);
        }
        strippedTask.content = strippedContent;

        return strippedTask;
    }
}

export { Task }