function addNewSubtask(taskDiv) {
    const containerLi = document.createElement('li');
    taskDiv.appendChild(containerLi);
    containerLi.dataset.type = 'sub-task';
    containerLi.classList.add('sub-task');
    containerLi.addEventListener('keydown', addNewSubtaskByPressingEnter);
    containerLi.addEventListener('keydown', gofromLiToTextArea);
    
    const checkBox = document.createElement('input');
    containerLi.appendChild(checkBox);
    checkBox.type = 'checkbox';
    
    const subTask = document.createElement('textarea');
    containerLi.appendChild(subTask);
    subTask.focus();
    
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

export { addNewSubtask }