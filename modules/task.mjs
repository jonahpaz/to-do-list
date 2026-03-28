class Task {
    constructor(data) {
        this.content = data.content;
        this.date = data.date ? data.date : false;
        this.time = data.time ? data.time : false;
        this.categoryId = data.categoryId ? data.categoryId : false;
        this.completed = false;
        this.id = crypto.randomUUID();
        Task.list.set(this.id, this);
        Task.updateStorage();
    }
    getDateTimeObj() {
        if (!this.date) return undefined;
        return new Date(`${this.date}T${this.time}`);
    }
    getStrippedTask() {
        const strippedTask = {};
    
        const schedule = this.date ? `${this.date}T${this.time}` : 'No alert';
        strippedTask.schedule = schedule;
    
        const strippedContent = [];
        for (const excerpt of this.content) {
            let strippedExcerpt = excerpt.type === 'mainTask' ? 
            excerpt.text : `- ${excerpt.text}`;
    
            strippedContent.push(strippedExcerpt);
        }
        strippedTask.content = strippedContent;
    
        return strippedTask;
    }
    
    static list = new Map();
    static data = [];
    
    static updateStorage() {
        this.updateData();
        localStorage.setItem('tasksData', JSON.stringify(this.data));
    }
    static updateData() {
        this.data.length = 0;
        for (const task of this.list.values()) {
            this.data.push(task);
        }
    }
    static getStrippedTasks() {
        const strippedTasks = [];
        for (const task of Task.list.values()) {
            let strippedTask = task.getStrippedTask();
            strippedTasks.push(strippedTask);
        }
        return strippedTasks;
    }
}

export { Task }