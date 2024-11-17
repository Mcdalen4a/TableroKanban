// Cargar las tareas desde localStorage al iniciar
document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const columns = ['todo', 'in-progress', 'done'];
    columns.forEach(column => {
        const tasks = JSON.parse(localStorage.getItem(column)) || [];
        tasks.forEach(task => {
            addTaskToColumn(column, task);
        });
    });
}

// Agregar tarea a la columna especificada
function addTask(column) {
    const taskDescription = prompt("Escribe la descripción de la tarea:");
    if (taskDescription) {
        const task = {
            id: Date.now(),
            description: taskDescription
        };
        addTaskToColumn(column, task);
        saveTasks();
    }
}

// Función para agregar la tarea a la columna correspondiente
function addTaskToColumn(column, task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.setAttribute("draggable", "true");
    taskDiv.setAttribute("data-id", task.id);

    // Crear el contenedor de la descripción y el botón de eliminar
    const taskContent = document.createElement("div");
    const taskText = document.createElement("span");
    taskText.textContent = task.description;
    
    // Crear el botón de eliminar
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => deleteTask(taskDiv));

    taskContent.appendChild(taskText);
    taskContent.appendChild(deleteButton);
    taskDiv.appendChild(taskContent);

    // Hacer que las tareas sean movibles
    taskDiv.addEventListener("click", () => editTask(taskDiv));
    taskDiv.addEventListener("dragstart", dragStart);

    document.getElementById(`${column}-tasks`).appendChild(taskDiv);
}

// Eliminar tarea
function deleteTask(taskDiv) {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
        const taskId = taskDiv.getAttribute("data-id");
        taskDiv.remove();  // Elimina la tarea de la vista
        saveTasks();       // Actualiza el localStorage
    }
}

// Editar tarea
function editTask(taskDiv) {
    const newDescription = prompt("Edita la tarea:", taskDiv.querySelector("span").textContent);
    if (newDescription) {
        taskDiv.querySelector("span").textContent = newDescription;
        saveTasks();
    }
}

// Función para permitir el arrastre de tareas
function allowDrop(event) {
    event.preventDefault();
}

// Función de arrastre al soltar
function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const taskDiv = document.querySelector(`[data-id="${taskId}"]`);
    const column = event.target.closest('.task-container');

    // Asegurarse de que se soltó en un contenedor válido
    if (column) {
        column.appendChild(taskDiv);
        saveTasks();
    }
}

// Función de inicio del arrastre
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.getAttribute("data-id"));
}

// Guardar las tareas en localStorage
function saveTasks() {
    const columns = ['todo', 'in-progress', 'done'];
    columns.forEach(column => {
        const tasks = [];
        const taskDivs = document.querySelectorAll(`#${column}-tasks .task`);
        taskDivs.forEach(taskDiv => {
            tasks.push({
                id: taskDiv.getAttribute("data-id"),
                description: taskDiv.querySelector("span").textContent
            });
        });
        localStorage.setItem(column, JSON.stringify(tasks));
    });
}
