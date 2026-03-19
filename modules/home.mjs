const searchLabel = document.createElement("label");

const lens = document.createElement("span");
lens.textContent = "lens";
searchLabel.appendChild(lens);

const search = document.createElement("input");
search.type = "search";
search.placeholder = "Search for tasks, events, etc...";
searchLabel.appendChild(search);



const content = document.createElement("div");

const h2 = document.createElement("h2");
h2.textContent = "My lists";
content.appendChild(h2);

const types = document.createElement("div");
types.classList.add("types");
content.appendChild(types);

const newListButton = document.createElement("button");
newListButton.textContent = "+";
newListButton.addEventListener("click", event => {
    let type = prompt("Create a new list");
    if (!type) return;
    createList(type);
});
types.appendChild(newListButton);

function createList(type) {
    const list = document.createElement("div");
    list.textContent = type;
    newListButton.before(list);
}
createList("Personal");
createList("Work");
createList("Grocery List");
