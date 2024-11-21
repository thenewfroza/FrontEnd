document.addEventListener("DOMContentLoaded", () => {
    const constructorForm = document.getElementById("constructorForm");
    const taskInput = document.getElementById("inputText");
    const taskList = document.getElementById("taskList");
    const filters = document.getElementById("filters");
    const taskTemplate = document.getElementById("taskTemplate");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let filter = "all";

    // Функция для отрисовки задач
    const renderTasks = () => {
        taskList.innerHTML = "";

        tasks
            .filter(task => filter === "all" || task.status === filter)
            .forEach(task => {
                const taskDiv = taskTemplate.content.cloneNode(true);
                const taskText = taskDiv.querySelector(".task-text");
                const selectStatus = taskDiv.querySelector(".change-status");
                const deleteButton = taskDiv.querySelector(".delete-task");

                taskText.textContent = task.text;
                selectStatus.value = task.status;

                taskDiv.querySelector(".task").classList.add(task.status);

                selectStatus.addEventListener("change", (event) => {
                    task.status = event.target.value;
                    saveTasks();
                    renderTasks();
                });

                deleteButton.addEventListener("click", () => {
                    tasks = tasks.filter(t => t !== task);
                    saveTasks();
                    renderTasks();
                });

                taskList.appendChild(taskDiv);
            });
    };

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    constructorForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, status: "todo" });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    filters.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            filter = event.target.getAttribute("data-filter");
            document.querySelectorAll("#filters button").forEach(button => button.classList.remove("active"));
            event.target.classList.add("active");
            renderTasks();
        }
    });

    renderTasks();
});
