document.addEventListener("DOMContentLoaded", () => {
    const constructorForm = document.getElementById("constructorForm");
    const taskInput = document.getElementById("inputText");
    const taskList = document.getElementById("taskList");
    const filters = document.getElementById("filters");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let filter = "all";

    const renderTasks = () => {
        taskList.innerHTML = "";

        tasks
            .filter(task => filter === "all" || task.status === filter)
            .forEach(task => {
                const taskDiv = document.createElement("div");
                taskDiv.className = `task ${task.status}`;
                taskDiv.innerHTML = `
                    <span>${task.text}</span>
                    <div>
                        <select class="change-status">
                            <option value="todo" ${task.status === "todo" ? "selected" : ""}>to do</option>
                            <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In progress</option>
                            <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
                        </select>
                        <button class="delete-task">Удалить</button>
                    </div>
                `;
                taskList.appendChild(taskDiv);

                taskDiv.querySelector(".change-status").addEventListener("change", (event) => {
                    task.status = event.target.value;
                    saveTasks();
                    renderTasks()
                });

                taskDiv.querySelector(".delete-task").addEventListener("click", () => {
                    tasks = tasks.filter(t => t !== task);
                    saveTasks();
                    renderTasks()
                });
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
            renderTasks()
        }
    });

    renderTasks();
});