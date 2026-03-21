import { Category } from "./categories.mjs";
import { Task } from "./task.mjs";

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



const categoriesContext = document.querySelector('#categories-context');
const categoryPagesDiv = document.querySelector('#pages');
const categoryCardsDiv = document.querySelector('#cards');
const createCategoryButton = document.querySelector('#create-category');
const categoryFormDialog = document.querySelector('#category-dialog');
const categoryNameInput = document.querySelector('#category-name');

createCategoryButton.addEventListener('click', () => categoryFormDialog.show());

const cancelCategoryButton = document.querySelector('#category-dialog .buttons .cancel');
cancelCategoryButton.addEventListener('click', () => {
    categoryNameInput.value = '';
    categoryFormDialog.close();
});

const doneCategoryButton = document.querySelector('#category-dialog .buttons .done');
doneCategoryButton.addEventListener('click', () => {
    if (!categoryNameInput.value) categoryFormDialog.close();
    createCategory();
    categoryFormDialog.close();
});

function createCategory(category) {
    if (!category) {
        const name = categoryNameInput.value;
        if (!name) return;
        const iconCode = document.querySelector('input[name="icon"]:checked').value;
        const type = 'custom';
        category = new Category(name, iconCode, type);
    }
    const categoryDialog = getCategoryDialog(category);
    createCategoryCard(category, categoryDialog);
    createCategoryInput(category);
}
function createCategoryCard(category, categoryDialog) {
    const categoryDiv = document.createElement('div');
    categoryCardsDiv.appendChild(categoryDiv);
    categoryDiv.tabIndex = 0;
    categoryDiv.dataset.id = category.id;
    categoryDiv.classList.add('card');
    categoryDiv.addEventListener('click', () => {
        categoryDialog.show();
        updateCategoryPage(categoryDialog);
    });
    
    const iconSpan = document.createElement('span');
    categoryDiv.appendChild(iconSpan);
    iconSpan.innerHTML = `&#${category.iconCode};`;
    
    const titleSpan = document.createElement('span');
    categoryDiv.appendChild(titleSpan);
    titleSpan.textContent = category.name;

    if (category.type === 'custom') {
        const deleteButton = document.createElement('button');
        categoryDiv.appendChild(deleteButton);
        deleteButton.type = 'button';
        deleteButton.innerHTML = '&#10060;';
        deleteButton.classList.add('delete', 'circle');
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const userSaidYes = confirm('Are you sure you want to permanently delete this category?');
            if (!userSaidYes) return;
            deleteCategory(category);
        });
    }
    
    const countSpan = document.createElement('span');
    categoryDiv.appendChild(countSpan);
    countSpan.dataset.id = category.id;
    countSpan.textContent = 0;
    countSpan.classList.add('count');
}
function updateCategoryPage(page) {
    const taskArea = page.lastElementChild;
    taskArea.innerHTML = '';
    const category = Category.lists.all.get(page.dataset.id);
    for (const task of category.tasks.values()) {
        let taskHTML = Task.list.get(task.id).element;
        taskArea.appendChild(taskHTML);
    }
}
function getCategoryDialog(category) {
    const categoryDialog = document.createElement('dialog');
    categoryPagesDiv.appendChild(categoryDialog);
    categoryDialog.dataset.id = category.id;
    categoryDialog.classList.add('page');
    categoryDialog.closedBy = 'any';
    
    const titleContainer = document.createElement('div');
    categoryDialog.appendChild(titleContainer);
    titleContainer.classList.add('title');

    const backButton = document.createElement('button');
    titleContainer.appendChild(backButton);
    backButton.classList.add('circle', 'back');
    backButton.textContent = '<=';
    backButton.addEventListener('click', () => categoryDialog.close());

    const titleH2 = document.createElement('h2');
    titleContainer.appendChild(titleH2);
    titleH2.textContent = category.name;

    if (category.name === 'Completed' && category.type === 'default') {
        const deleteAllButton = document.createElement('button');
        titleContainer.appendChild(deleteAllButton);
        deleteAllButton.classList.add('empty');
        deleteAllButton.textContent = 'Empty list';
        deleteAllButton.addEventListener('click', deleteAllCompletedTasks);
    }

    const taskContainer = document.createElement('div');
    categoryDialog.appendChild(taskContainer);
    taskContainer.classList.add('tasks');

    return categoryDialog
}
function createCategoryInput(category) {
    if (category.unselectable) return;

    const li = document.createElement('li');
    categoriesContext.firstElementChild.appendChild(li);

    const label = document.createElement('label');
    li.appendChild(label);

    const input = document.createElement('input');
    label.appendChild(input);
    input.dataset.id = category.id;
    input.type = 'radio';
    input.name = 'category';
    input.value = category.name;

    const span = document.createElement('span');
    label.appendChild(span);
    span.innerHTML = `&#${category.iconCode};`;

    const text = document.createTextNode(category.name);
    label.appendChild(text);
}
function deleteCategory(category) {
    for (const task of category.tasks.values()) {
        task.categoryId = undefined;
    }
    Category.lists.custom.delete(category.id);
    Category.lists.all.delete(category.id)
    const categoryCard = document.querySelector(`.card[data-id="${category.id}"]`);
    categoryCard.remove();
    const categoryDialog = document.querySelector(`.page[data-id="${category.id}"]`);
    categoryDialog.remove();
    const categoryInput = document.querySelector(`input[data-id="${category.id}"]`);
    categoryInput.parentElement.parentElement.remove();
}
function deleteAllCompletedTasks() {
    const userSaidYes = confirm('Are you sure you want to delete permanently every completed task?');
    if (!userSaidYes) return;
    const completedCategory = Category.lists.default.get('Completed');
    for (const task of completedCategory.tasks.values()) {
        Category.remove(task);
        const taskHTML = Task.list.get(task.id).element;
        taskHTML.classList.add('is-completing');
        setTimeout(() => {
            taskHTML.remove();
        }, 500);
        Task.list.delete(task.id);
        updateTaskCount();
    }
}
function updateTaskCount(selectedCategoryRadio) {
    for (const category of Category.lists.all.values()) {
        const categoryDiv = document.querySelector(`.card[data-id="${category.id}"]`);
        const countSpan = categoryDiv.lastElementChild;
        countSpan.textContent = category.tasks.size;
    }
}
function createDefaultCategories() {
    for (const category of Category.lists.default.values()) {
        createCategory(category);
    }
}



createDefaultCategories();

export { updateTaskCount }

