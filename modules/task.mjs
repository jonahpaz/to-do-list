class Task {
    constructor(data) {
        this.content = data.content;
        this.date = data.date;
        this.time = data.time;
        this.categoryId = data.categoryId;
        this.completed = false;
        this.id = crypto.randomUUID();
        this.dateTimeObj = this.getDateTimeObj();
        Task.list.set(this.id, {object: this});
    }
    getDateTimeObj() {
        if (!this.date) return undefined;
        return new Date(`${this.date}T${this.time}`);
    }

    static list = new Map();
    
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